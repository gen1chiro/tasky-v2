import {useState, useEffect, useRef} from "react"
import { useLoaderData, useParams } from "react-router-dom"
import {
    DndContext,
    type DragStartEvent,
    type DragEndEvent,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragOverlay,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import {addColumn, editColumn} from "../firebase/firestore/columns.ts"
import { db } from "../firebase/firebase.ts"
import { collection, onSnapshot, query, orderBy, getDocs } from "firebase/firestore"
import Column, { ColumnPreview } from "../components/Column.tsx"
import { addTaskAtPosition, deleteTask, editTask } from "../firebase/firestore/tasks.ts"
import { TaskPreview } from "../components/Task.tsx"

const BoardPage = () => {
    const { board: initialBoard } = useLoaderData()
    const [columns, setColumns] = useState(initialBoard || [])
    const [columnName, setColumnName] = useState<string>('')
    const [taskName, setTaskName] = useState<string>('')
    const [activeTaskId, setActiveTaskId] = useState<string>('')
    const [activeColumnId, setActiveColumnId] = useState<string>('')
    const lastColumnId = useRef<string | null>(null)
    const latestColumns = useRef(columns)
    const { boardId } = useParams<{ boardId: string }>()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        const columnsCollectionRef = collection(db, 'boards', boardId as string, 'columns')
        const columnsQuery = query(columnsCollectionRef, orderBy('position', 'asc'))

        const unsubscribeColumns = onSnapshot(columnsQuery, async (snapshot) => {
            const columnPromises = snapshot.docs.map(async (doc) => {
                const tasksRef = collection(db, 'boards', boardId as string, 'columns', doc.id, 'tasks')
                const tasksQuery = query(tasksRef, orderBy('position', 'asc'))
                const taskSnapshot = await getDocs(tasksQuery)

                return {
                    id: doc.id,
                    ...doc.data(),
                    tasks: taskSnapshot.docs.map(taskDoc => ({
                        id: taskDoc.id,
                        columnId: doc.id,
                        ...taskDoc.data()
                    }))
                }
            })

            const updatedColumns = await Promise.all(columnPromises)
            setColumns(updatedColumns)
        })

        return () => unsubscribeColumns()
    }, [boardId])

    useEffect(() => {
        if (!columns.length) return

        const unsubscribers = columns.map(column => {
            const tasksRef = collection(db, 'boards', boardId as string, 'columns', column.id, 'tasks')
            const tasksQuery = query(tasksRef, orderBy('position', 'asc'))

            return onSnapshot(tasksQuery, (snapshot) => {
                const updatedTasks = snapshot.docs.map(doc => ({
                    id: doc.id,
                    columnId: column.id,
                    ...doc.data()
                }))

                setColumns(prevColumns =>
                    prevColumns.map(col =>
                        col.id === column.id
                            ? { ...col, tasks: updatedTasks }
                            : col
                    )
                )
            })
        })

        return () => unsubscribers.forEach(unsubscribe => unsubscribe())
    }, [boardId])

    const findColumn = (id) => {
        const container = columns.find(column => column.id === id)
        if (container) return container

        return columns.find((column) =>
            column.tasks.some((item) => item.id === id)
        )
    }

    const isColumn = (id) => {
        return columns.some(column => column.id === id)
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const { id } = active

        if (isColumn(id)) {
            setActiveColumnId(id as string)
        } else {
            setActiveTaskId(id as string)
            lastColumnId.current = active.data.current?.columnId as string
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        //In column task DND
        const { active, over } = event
        const { id } = active
        const overId = over ? over.id : null

        const activeContainer = findColumn(id)
        const overContainer = findColumn(overId)

        if (!activeContainer || !overContainer || isColumn(id)) {
            return
        }

        const isSameContainer = lastColumnId.current === overContainer.id

        if (isSameContainer) {
            console.log('Same container DND')
            const activeIndex = activeContainer.tasks.findIndex((task) => task.id === id)
            const overIndex = overContainer.tasks.findIndex((task) => task.id === overId)

            if (activeIndex !== overIndex) {
                const newColumnTasks = columns.map(column =>
                    column.id === activeContainer.id
                        ? {
                            ...column,
                            tasks: arrayMove(column.tasks, activeIndex, overIndex)
                        }
                        : column
                )

                setColumns(newColumnTasks)

                await Promise.all(
                    newColumnTasks.map(columnTask =>
                        columnTask.tasks.map((task, index) =>
                            task.columnId === activeContainer.id
                                ? editTask(boardId as string, activeContainer.id, task.id, index, "position")
                                : null
                        )
                    )
                )
            }
        } else {
            if (!activeContainer || !overContainer) return
            console.log('Cross column task DND')
            /*
            if (!activeContainer || !overContainer) return

            const movedItem = activeContainer.tasks.find(task => task.id === id)
            const overTasks = overContainer.tasks

            const newIndex = overTasks.findIndex(task => task.id === overId)
            const finalIndex = newIndex === -1 ? overTasks.length : newIndex

            await deleteTask(boardId as string, activeContainer.id, movedItem.id)
            await addTaskAtPosition(boardId as string, overContainer.id, movedItem.name, finalIndex)

            const newColumns = latestColumns.current

            await Promise.all(
                newColumns.map(column =>
                    column.id === overContainer.id
                        ? column.tasks.map((task, index) =>
                            editTask(boardId as string, column.id, task.id, index, "position")
                        ) : null
                )
            )
             */
        }

        setActiveTaskId(null)
        setActiveColumnId(null)
    }

    const handleDragOver = async (event) => {
        const { active, over } = event
        const { id } = active
        const overId = over ? over.id : null

        // Handle container reordering
        if (isColumn(id)) {
            if (!over) return

            let targetContainerId = overId

            // If hovering over an item, find its parent container
            if (!isColumn(overId)) {
                const overContainer = findColumn(overId)
                if (!overContainer) return
                targetContainerId = overContainer.id
            }

            const activeIndex = columns.findIndex(container => container.id === id)
            const overIndex = columns.findIndex(container => container.id === targetContainerId)

            const newColumns = arrayMove(columns, activeIndex, overIndex)
            setColumns(newColumns)

            await Promise.all(
                newColumns.map((column, index) =>
                    editColumn(boardId as string, column.id, index, "position")
                )
            )

            return
        }
        // Cross column task DND
        const activeContainer = findColumn(id)
        const overContainer = findColumn(overId)

        if (!activeContainer || !overContainer || activeContainer.id === overContainer.id) {
            return
        }

        const activeItems = activeContainer.tasks
        const overItems = overContainer.tasks

        const activeIndex = activeItems.findIndex((task) => task.id === id)
        const overIndex = overItems.findIndex((task) => task.id === overId)

        let newIndex
        if (overId) {
            const isBelowLastItem =
                over &&
                overIndex === overItems.length - 1 &&
                active.rect.offsetTop > over.rect.offsetTop + over.rect.height

            const modifier = isBelowLastItem ? 1 : 0

            newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
        } else {
            newIndex = overItems.length + 1
        }

        const movedItem = {
            ...activeItems[activeIndex],
            columnId: overContainer.id
        }

        const newColumns = columns.map((container) => {
            if (container.id === activeContainer.id) {
                return {
                    ...container,
                    tasks: activeItems.filter(item => item.id !== id)
                }
            }
            if (container.id === overContainer.id) {
                return {
                    ...container,
                    tasks: [
                        ...overItems.slice(0, newIndex),
                        movedItem,
                        ...overItems.slice(newIndex)
                    ]
                }
            }
            return container
        })

        setColumns(newColumns)
        latestColumns.current = newColumns
    }

    const columnElements = columns.map((column) => {
        return (
            <Column key={column.id} boardId={boardId} column={column} taskName={taskName} columnName={columnName} setTaskName={setTaskName} tasks={column.tasks}/>
        )
    })

    return (
        <div>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver} sensors={sensors} collisionDetection={closestCenter}>
                <h1>Board</h1>
                <input type='text' value={columnName} onChange={(e) => setColumnName(e.target.value)}
                       className='border-black border'/>
                <button onClick={() => addColumn(boardId as string, columnName)}>Add</button>
                <SortableContext items={columns.map(column => column.id)} strategy={horizontalListSortingStrategy}>
                    <div className='flex gap-4 bg-slate-400'>
                        {columnElements}
                    </div>
                </SortableContext>
                <DragOverlay>
                    {activeTaskId
                        ? <TaskPreview/>
                        : activeColumnId
                            ? <ColumnPreview/>
                            : null
                    }
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default BoardPage