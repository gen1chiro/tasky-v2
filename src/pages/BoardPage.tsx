import {useState, useEffect, useRef} from "react"
import {useLoaderData, useParams} from "react-router-dom"
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragOverlay,
} from "@dnd-kit/core"
import {SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates} from "@dnd-kit/sortable"
import {addColumn} from "../firebase/firestore/columns.ts"
import {handleDragStart, handleDragEnd, handleDragOver} from "../utils/dnd/dndUtils.ts"
import {db} from "../firebase/firebase.ts"
import {collection, onSnapshot, query, orderBy, getDocs} from "firebase/firestore"
import Column, {ColumnPreview} from "../components/Column.tsx"
import {TaskPreview} from "../components/Task.tsx"

const BoardPage = () => {
    const {board: initialBoard} = useLoaderData()
    const [columns, setColumns] = useState(initialBoard || [])
    const [columnName, setColumnName] = useState<string>('')
    const [taskName, setTaskName] = useState<string>('')
    const [activeTask, setActiveTask] = useState<string>(null)
    const [activeColumn, setActiveColumn] = useState(null)
    const lastColumnId = useRef<string | null>(null)
    const {boardId} = useParams<{ boardId: string }>()

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
                            ? {...col, tasks: updatedTasks}
                            : col
                    )
                )
            })
        })

        return () => unsubscribers.forEach(unsubscribe => unsubscribe())
    }, [boardId])

    const columnElements = columns.map((column) => {
        return (
            <Column key={column.id} boardId={boardId} column={column} taskName={taskName} columnName={columnName}
                    setTaskName={setTaskName} tasks={column.tasks}/>
        )
    })

    return (
        <div>
            <DndContext onDragStart={(e) => handleDragStart(e, columns, setActiveColumn, lastColumnId, setActiveTask)}
                        onDragEnd={(e) => handleDragEnd(e, columns, setColumns, lastColumnId, boardId, setActiveTask, setActiveColumn)}
                        onDragOver={(e) => handleDragOver(e, columns, setColumns, boardId)}
                        sensors={sensors} collisionDetection={closestCenter}>
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
                    {activeTask
                        ? <TaskPreview task={activeTask}/>
                        : activeColumn
                            ? <ColumnPreview column={activeColumn}/>
                            : null
                    }
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default BoardPage