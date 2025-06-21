import { db } from '../firebase.ts'
import { collection, addDoc, getDocs, serverTimestamp, query, where } from 'firebase/firestore'
import type {Board} from "../../types/types.ts";

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

        return  snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data() as Omit<Board, "id">
        }))

    } catch (err) {
        console.error('Error fetching boards:', err)
        throw new Error('Failed to fetch boards')
    }
}