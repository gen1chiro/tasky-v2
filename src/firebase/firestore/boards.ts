import {db} from '../firebase.ts'
import {
    doc,
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    getDoc,
    deleteDoc,
    updateDoc,
    orderBy
} from 'firebase/firestore'
import type {Board} from "../../types/types.ts"
import requireAuth from "../uitls/requireAuth.ts"
import type {User} from "firebase/auth"

export const createBoard = async (userUID: string, boardName: string, includeDefaults: boolean, color: string) => {
    try {
        const collectionRef = collection(db, 'boards')
        const boardRef = await addDoc(collectionRef, {
            name: boardName,
            owner: userUID,
            color: color,
            members: [userUID],
            createdAt: serverTimestamp(),
        })

        if (!includeDefaults) return boardRef.id

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

export const addBoardMember = async (boardId: string, userUID: string) => {
    try {
        const boardRef = doc(db, 'boards', boardId)
        await updateDoc(boardRef, {
            members: [...(await getDoc(boardRef)).data()?.members || [], userUID]
        })
    } catch (err) {
        console.error('Error adding board member:', err)
        throw new Error('Failed to add board member')
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

export const renameBoard = async (boardId: string, newName: string) => {
    try {
        await updateDoc(doc(db, 'boards', boardId), {
            name: newName
        })
    } catch (err) {
        console.error('Error renaming board:', err)
    }
}

export const boardLoader = async ({params}: { params: { boardId: string } }) => {
    const {boardId} = params
    const user = await requireAuth() as User

    const boardDoc = await getDoc(doc(db, 'boards', boardId))
    const data = boardDoc.data() as Board

    if (!boardDoc.exists()) {
        throw new Response('Not Found', {status: 404})
    }

    if (data.owner !== user?.uid && !data.members.includes(user?.uid)) {
        throw new Response('Forbidden', {status: 403})
    }

    const boardDataPromise = async () => {
        const columnRef = collection(db, 'boards', boardId, 'columns')
        const columnQuery = query(columnRef, orderBy('position', 'asc'))
        const columnSnapshot = await getDocs(columnQuery)

        return Promise.all(
            columnSnapshot.docs.map(async (columnDoc) => {
                const tasksRef = collection(db, 'boards', boardId, 'columns', columnDoc.id, 'tasks')
                const taskQuery = query(tasksRef, orderBy('position', 'asc'))
                const taskSnapshot = await getDocs(taskQuery)
                return {
                    id: columnDoc.id,
                    ...columnDoc.data(),
                    tasks: taskSnapshot.docs.map(taskDoc => ({
                        id: taskDoc.id,
                        columnId: columnDoc.id,
                        ...taskDoc.data()
                    }))
                }
            })
        )
    }

    return ({
        boardInfo: data,
        initialBoardData: boardDataPromise()
    })
}