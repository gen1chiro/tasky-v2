import {db} from '../firebase.ts'
import {
    doc,
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    where,
    getDoc,
    deleteDoc,
    updateDoc,
    orderBy
} from 'firebase/firestore'
import type {Board} from "../../types/types.ts"
import requireAuth from "../uitls/requireAuth.ts"

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

export const boardLoader = async ({params}: { params: { boardId: string } }) => {
    const {boardId} = params
    const user = await requireAuth()


    const boardDoc = await getDoc(doc(db, 'boards', boardId))
    const data = boardDoc.data() as Board

    if (!boardDoc.exists()) {
        throw new Response('Not Found', {status: 404})
    }

    if (data.owner !== user?.uid) {
        throw new Response('Forbidden', {status: 403})
    }

    const columnRef = collection(db, 'boards', boardId, 'columns')
    const columnQuery = query(columnRef, orderBy('position', 'asc'))
    const columnSnapshot = await getDocs(columnQuery)
    const columns = columnSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }))

    const tasks = (await Promise.all(
        columnSnapshot.docs.map(async (doc) => {
            const tasksRef = collection(db, 'boards', boardId, 'columns', doc.id, 'tasks')
            const taskQuery = query(tasksRef, orderBy('position', 'asc'))
            const taskSnapshot = await getDocs(taskQuery)

            return taskSnapshot.docs.map((taskDoc) => ({
                    id: taskDoc.id,
                    ...taskDoc.data()
                })
            )
        })
    )).flat()

    return {columns, tasks}
}