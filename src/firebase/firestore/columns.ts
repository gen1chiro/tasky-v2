import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase.ts";

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