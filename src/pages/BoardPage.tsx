import { useState, useEffect } from "react"
import { useLoaderData, useParams } from "react-router-dom"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { addColumn } from "../firebase/firestore/columns.ts"
import { db } from "../firebase/firebase.ts"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import reindexDocs from "../firebase/uitls/reindexDocs.ts"
import Column from "../components/Column.tsx"

const BoardPage = () => {
    const loaderData = useLoaderData()
    const [columns, setColumns] = useState(loaderData.columns || [])
    const [tasks, setTasks] = useState(loaderData.tasks || [])
    const [columnName, setColumnName] = useState<string>('')
    const [taskName, setTaskName] = useState<string>('')
    const { boardId } = useParams<{ boardId: string }>()

    useEffect(() => {
        const columnsCollectionRef = collection(db, 'boards', boardId as string, 'columns')
        const columnsQuery = query(columnsCollectionRef, orderBy('position', 'asc'))

        const unsubscribeColumns = onSnapshot(columnsQuery, async (snapshot) => {
            const updatedColumns = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setColumns(updatedColumns)

            const needsReindexing = updatedColumns.some((col, index) => col.position !== index)
            if (needsReindexing) {
                await reindexDocs(columnsCollectionRef, updatedColumns)
            }
        })


        return () => unsubscribeColumns()
    }, [boardId])

    useEffect(() => {
        if (!columns.length) return

        const taskUnsubscribers = new Map()

        columns.forEach(column => {
            const tasksRef = collection(db, 'boards', boardId as string, 'columns', column.id, 'tasks')
            const tasksQuery = query(tasksRef, orderBy('position', 'asc'))

            const unsubscribe = onSnapshot(tasksQuery, async (snapshot) => {
                const columnTasks = snapshot.docs.map(doc => ({
                    id: doc.id,
                    columnId: column.id,
                    ...doc.data()
                }))

                const needsReindexing = columnTasks.some((task, index) => task.position !== index)
                if (needsReindexing) {
                    await reindexDocs(tasksRef, columnTasks)
                }

                setTasks(prevTasks => {
                    const otherTasks = prevTasks.filter(task => task.columnId !== column.id)
                    return [...otherTasks, ...columnTasks]
                })
            })

            console.log(columns, tasks)
            taskUnsubscribers.set(column.id, unsubscribe)
        })

        return () => {
            taskUnsubscribers.forEach(unsubscribe => unsubscribe())
        }
    }, [boardId, columns])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) return

        console.log(active.id, over.id)

        const taskId = active.id
        const columnId = over.id

        setTasks((prevTasks) =>
            prevTasks.map(task =>
                task.id === taskId ?
                    {
                       ...task,
                       columnId: columnId
                    } : task
            )
        )
    }

    const columnElements = columns.map((column) => {
        return (
            <Column boardId={boardId} column={column} taskName={taskName} columnName={columnName} setTaskName={setTaskName} tasks={tasks}/>
        )
    })

    return (
        <div>
            <DndContext onDragEnd={handleDragEnd}>
                <h1>Board</h1>
                <input type='text' value={columnName} onChange={(e) => setColumnName(e.target.value)}
                       className='border-black border'/>
                <button onClick={() => addColumn(boardId as string, columnName)}>Add</button>
                <div className='flex gap-4'>
                    {columnElements}
                </div>
            </DndContext>
        </div>
    )
}

export default BoardPage