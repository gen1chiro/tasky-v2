import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy
} from "firebase/firestore"
import { db } from '../firebase.ts'
import type { Task } from "../../types/types.ts"

export const addTask = async (boardId: string, columnId: string, taskName: string) => {
    try {
        const taskCollectionRef = collection(db, 'boards', boardId, 'columns', columnId, 'tasks')
        const taskQuery = query(taskCollectionRef, orderBy('position', 'desc'))
        const tasksSnapshot = await getDocs(taskQuery)

        const newTaskPosition = !tasksSnapshot.empty ? tasksSnapshot.docs[0].data().position + 1 : 0

        await addDoc(taskCollectionRef, {
            name: taskName,
            columnId: columnId,
            position: newTaskPosition,
            createdAt: serverTimestamp(),
        })
    } catch (err) {
        console.error('Error adding task:', err)
        throw new Error('Failed to add task')
    }
}

export const editTask = async (boardId: string, columnId: string, taskId: string, newValue, key: keyof Task) => {
    try {
        const taskDocRef = doc(db, 'boards', boardId, 'columns', columnId, 'tasks', taskId)
        await updateDoc<Task>(taskDocRef, {
            [key]: newValue
        })
    } catch (err) {
        console.error('Error editing task:', err)
        throw new Error('Failed to edit task')
    }
}

export const deleteTask = async (boardId: string, columnId: string, taskId: string) => {
    try {
        const taskDocRef = doc(db, 'boards', boardId, 'columns', columnId, 'tasks', taskId)
        await deleteDoc(taskDocRef)
    } catch (err) {
        console.error('Error deleting task:', err)
        throw new Error('Failed to delete task')
    }
}