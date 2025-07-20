import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from "firebase/firestore"
import { db } from "../firebase.ts"
import type { Column } from "../../types/types.ts"

export const addColumn = async (boardId: string, columnName: string) => {
    try {
        const columnsCollectionRef = collection(db, 'boards', boardId, 'columns')
        const columnQuery = query(columnsCollectionRef, orderBy('position', 'desc'))
        const columnSnapshot = await getDocs(columnQuery)

        const newColumnPosition = !columnSnapshot.empty ? columnSnapshot.docs[0].data().position + 1 : 0

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

export const editColumn = async (boardId: string, columnId: string, newValue, key: keyof Column) => {
    try {
        const columnDocRef = doc(db, 'boards', boardId, 'columns', columnId)
        await updateDoc<Column>(columnDocRef, {
            [key]: newValue
        })
    } catch (err) {
        console.error('Error renaming column:', err)
        throw new Error('Failed to rename column')
    }
}