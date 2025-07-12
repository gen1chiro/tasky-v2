import { useState, useEffect } from "react"
import { useLoaderData, useParams } from "react-router-dom"
import {DndContext, type DragEndEvent} from "@dnd-kit/core"
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import {addColumn, editColumn} from "../firebase/firestore/columns.ts"
import { db } from "../firebase/firebase.ts"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import Column from "../components/Column.tsx"
import { addTask, deleteTask } from "../firebase/firestore/tasks.ts"

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

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) return

        const isColumnDrag = active.data?.current?.type === 'column'

        if (isColumnDrag) {
            const { active, over } = event
            if (!over || active.id === over.id) return

            const oldIndex = columns.findIndex(col => col.id === active.id)
            const newIndex = columns.findIndex(col => col.id === over.id)

            const newColumns = arrayMove(columns, oldIndex, newIndex)
            setColumns(newColumns)

            await Promise.all(
                newColumns.map((col, index) =>
                    editColumn(boardId as string, col.id, index, "position")
                )
            )
        } else {
            const task = tasks.find(task => task.id === active.id)
            if (!task || task.columnId === over.id) return

            setTasks((prevTasks) =>
                prevTasks.map(t =>
                    t.id === active.id ?
                        { ...t, columnId: over.id as string } :
                        t
                )
            )

            await deleteTask(boardId as string, task.columnId, active.id as string)
            await addTask(boardId as string, over.id as string, task.name)
        }
    }

    const columnElements = columns.map((column) => {
        return (
            <Column key={column.id} boardId={boardId} column={column} taskName={taskName} columnName={columnName} setTaskName={setTaskName} tasks={tasks}/>
        )
    })

    return (
        <div>
            <DndContext onDragEnd={handleDragEnd}>
                <h1>Board</h1>
                <input type='text' value={columnName} onChange={(e) => setColumnName(e.target.value)}
                       className='border-black border'/>
                <button onClick={() => addColumn(boardId as string, columnName)}>Add</button>
                <SortableContext items={columns.map(column => column.id)} strategy={horizontalListSortingStrategy}>
                    <div className='flex gap-4 bg-slate-400'>
                        {columnElements}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default BoardPage