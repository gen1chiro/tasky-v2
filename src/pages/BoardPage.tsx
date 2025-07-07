import { useState, useEffect } from "react"
import { useLoaderData, useParams } from "react-router-dom"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { addColumn, deleteColumn, renameColumn } from "../firebase/firestore/columns.ts"
import { db } from "../firebase/firebase.ts"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import reindexDocs from "../firebase/uitls/reindexDocs.ts";
import { addTask } from "../firebase/firestore/tasks.ts";
import Task from "../components/Task.tsx";

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
    }

    const columnElements = columns.map((column) => {
        return (
            <div key={column.id} className='flex flex-col items-center justify-center gap-4 w-80 bg-slate-300 p-4'>
                <h2 className='text-center font-bold'>{column.name}</h2>
                <div className='flex justify-center gap-2'>
                    <button onClick={() => renameColumn(boardId as string, column.id, columnName)} className='bg-white rounded-md px-2'>Rename</button>
                    <button onClick={() => deleteColumn(boardId as string, column.id)} className='bg-white rounded-md px-2'>Delete</button>
                </div>
                <div className='w-full flex gap-2 justify-center'>
                    <input type='text' value={taskName} onChange={(e) => setTaskName(e.target.value)} className='bg-white flex-shrink'/>
                    <button onClick={() => addTask(boardId as string, column.id, taskName)} className='bg-white rounded-md px-2'>add</button>
                </div>
                <div className="w-full bg-white">
                    {tasks
                        .filter((task) => task.columnId === column.id)
                        .map((task) => (
                            <Task task={task} boardId={boardId} column={column} taskName={taskName}/>
                        ))}
                </div>
            </div>
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