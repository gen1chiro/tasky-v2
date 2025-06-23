import { db } from '../firebase.ts'
import { doc, collection, addDoc, getDocs, serverTimestamp, query, where, getDoc} from 'firebase/firestore'
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

export const getBoardsByUser = async (userUID: string) => {
    try {
        const q = query(
            collection(db, 'boards'),
            where('owner', '==', userUID)
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

        const columnSnapshot = await getDocs(collection(db, 'boards', boardId, 'columns'))
        return columnSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (err) {
        console.error('Error loading board:', err)
        throw new Error('Failed to load board')
    }
}