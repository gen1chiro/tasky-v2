import {useState, useEffect, useRef} from "react"
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
import {addColumn} from "../../firebase/firestore/columns.ts"
import {handleDragStart, handleDragEnd, handleDragOver} from "../../utils/dnd/dndUtils.ts"
import {db} from "../../firebase/firebase.ts"
import {collection, onSnapshot, query, orderBy, getDocs} from "firebase/firestore"
import Column, {ColumnPreview} from "./Column.tsx"
import {TaskPreview} from "./Task.tsx"
import Modal from "./modal/Modal.tsx"
import ModalHeader from "./modal/ModalHeader.tsx"
import ModalMessage from "./modal/ModalMessage.tsx"
import {IoIosAdd} from "react-icons/io"
import type {Column as ColumnType, Task as TaskType} from "../../types/types.ts"

interface BoardProps {
    initialBoardData: ColumnType[]
    boardId: string
}

const Board = ({ initialBoardData, boardId }: BoardProps) => {
    const [columns, setColumns] = useState(initialBoardData || [])
    const [activeTask, setActiveTask] = useState<TaskType | null>(null)
    const [activeColumn, setActiveColumn] = useState(null)
    const lastColumnId = useRef<string | null>(null)
    const addColumnRef = useRef<HTMLDialogElement | null>(null)

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
                    })) as TaskType[]
                } as ColumnType
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
                    ) as ColumnType[]
                )
            })
        })
        return () => unsubscribers.forEach(unsubscribe => unsubscribe())
    }, [boardId, columns.length])

    const showAddColumnModal = () => {
        addColumnRef.current?.showModal()
    }

    const hideAddColumnModal = () => {
        addColumnRef.current?.close()
    }

    const handleAddColumn = async (data: FormData) => {
        hideAddColumnModal()
        const column = Object.fromEntries(data)
        await addColumn(boardId as string, column)
    }

    const columnElements = columns.map((column) => {
        return (
            <Column key={column.id} boardId={boardId} column={column}/>
        )
    })

    return (
        <>
            <DndContext
                onDragStart={(e) => handleDragStart(e, columns, setActiveColumn, lastColumnId, setActiveTask)}
                onDragEnd={(e) => handleDragEnd(e, columns, setColumns, lastColumnId, boardId, setActiveTask, setActiveColumn)}
                onDragOver={(e) => handleDragOver(e, columns, setColumns, boardId)}
                sensors={sensors} collisionDetection={closestCenter}>
                <SortableContext items={columns.map(column => column.id)} strategy={horizontalListSortingStrategy}>
                    <div
                        className='w-full flex-grow flex gap-4 items-start overflow-auto p-4 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]'>
                        {columnElements}
                        <button onClick={showAddColumnModal}
                                className='bg-white rounded border border-slate-100 shadow hover:bg-slate-100 p-2'>
                            <IoIosAdd className='text-gray-600 text-xl'/>
                        </button>
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

            <Modal ref={addColumnRef} onClose={hideAddColumnModal}>
                <ModalHeader>Column Details</ModalHeader>
                <ModalMessage>Enter column details below.</ModalMessage>
                <form action={handleAddColumn} className='w-full flex flex-col gap-3 mt-4'>
                    <div className='flex flex-col'>
                        <label htmlFor='name' className='text-sm'>Column Name</label>
                        <input id='name' name='name' className='px-2 text-gray-600 border-gray-300 border rounded'
                               required/>
                    </div>
                    <div className='w-full flex justify-end gap-2 mt-4'>
                        <button onClick={hideAddColumnModal} type='button'
                                className='border-gray-300 border-1 px-6 py-1 rounded text-sm hover:bg-gray-100'>Cancel
                        </button>
                        <button
                            className='bg-black px-6 py-1 rounded text-white text-sm hover:bg-zinc-800'>Add
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default Board