import { db } from '../firebase.ts'
import { doc, collection, addDoc, getDocs, serverTimestamp, query, where, getDoc, deleteDoc, updateDoc, orderBy } from 'firebase/firestore'
import type { Board } from "../../types/types.ts"
import requireAuth from "../../uitls/requireAuth.ts"

export const createBoard = async (userUID: string, boardName: string) => {
    try {
        const collectionRef = collection(db, 'boards')
        const boardRef = await addDoc(collectionRef, {
            name: boardName,
            owner: userUID,
            createdAt: serverTimestamp(),
        })

        const defaultColumns = ["To Do", "In Progress", "Done"]
        const columnsCollectionRef = collection(db, 'boards', boardRef.id, 'columns')

        await Promise.all(
            defaultColumns.map(async (columnName, index) => {
                await addDoc(columnsCollectionRef, {
                    name: columnName,
                    position: index,
                    createdAt: serverTimestamp(),
                })
            })
        )

        return boardRef.id
    } catch (err) {
        console.error('Error creating board:', err)
        throw new Error('Failed to create board')
    }
}

export const deleteBoard = async (boardId: string) => {
    try {
        await deleteDoc(doc(db, 'boards', boardId))
    } catch (err) {
        console.error('Error deleting board:', err)
        throw new Error('Failed to delete board')
    }
}

export const renameBoard = async (boardId: string, newName) => {
    try {
        await updateDoc(doc(db, 'boards', boardId), {
            name: newName
        })
    } catch (err) {
        console.error('Error renaming board:', err)
    }
}

export const getBoardsByUser = async (userUID: string) => {
    try {
        const q = query(
            collection(db, 'boards'),
            where('owner', '==', userUID),
        )

        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data() as Omit<Board, "id">
        }))

    } catch (err) {
        console.error('Error fetching boards:', err)
        throw new Error('Failed to fetch boards')
    }
}

export const boardLoader = async ({params}: {params: {boardId: string}}) => {
    const {boardId} = params
    const user = await requireAuth()

    try {
        const boardDoc = await getDoc(doc(db, 'boards', boardId))
        const data = boardDoc.data() as Board

        if (!boardDoc.exists()) {
            throw new Error('Board not found')
        }

        if (data.owner !== user?.uid) {
            throw new Error('Unauthorized access to this board')
        }

        const columnRef = collection(db, 'boards', boardId, 'columns')
        const columnQuery = query(columnRef, orderBy('position', 'asc'))
        const columnSnapshot = await getDocs(columnQuery)
        return columnSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (err) {
        console.error('Error loading board:', err)
        throw new Error('Failed to load board')
    }
}

export const addColumn = async (boardId: string, columnName: string) => {
    try {
        const columnsCollectionRef = collection(db, 'boards', boardId, 'columns')
        const columnSnapshot = await getDocs(columnsCollectionRef)

        const newColumnPosition = columnSnapshot.docs.length

        console.log(newColumnPosition)

        await addDoc(columnsCollectionRef, {
            name: columnName,
            position: newColumnPosition,
            createdAt: serverTimestamp(),
        })
    } catch (err) {
        console.error('Error adding column:', err)
        throw new Error('Failed to add column')
    }
}

export const deleteColumn = async (boardId: string, columnId: string) => {
    try {
        const columnDocRef = doc(db, 'boards', boardId, 'columns', columnId)
        await deleteDoc(columnDocRef)
    } catch (err) {
        console.error('Error deleting column:', err)
        throw new Error('Failed to delete column')
    }
}

export const renameColumn = async (boardId: string, columnId: string, newName) => {
    try {
        const columnDocRef = doc(db, 'boards', boardId, 'columns', columnId)
        await updateDoc(columnDocRef, {
            name: newName
        })
    } catch (err) {
        console.error('Error renaming column:', err)
        throw new Error('Failed to rename column')
    }
}