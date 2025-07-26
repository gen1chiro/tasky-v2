import {useRef} from "react";
import {useDroppable} from "@dnd-kit/core"
import {useSortable, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {deleteColumn, editColumn} from "../firebase/firestore/columns.ts"
import {addTask} from "../firebase/firestore/tasks.ts"
import Task, {TaskPreview} from "./Task.tsx"
import type {Column} from "../types/types.ts"
import Modal from "./modal/Modal.tsx"
import ModalHeader from "./modal/ModalHeader.tsx"
import ModalMessage from "./modal/ModalMessage.tsx"

const Column = ({column, tasks, boardId, columnName, taskName, setTaskName}: { column: Column }) => {
    const deleteModalRef = useRef<HTMLDialogElement | null>(null)

    const {setNodeRef: setDroppableRef} = useDroppable({
        id: column.id
    })

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: column.id
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const showDeleteModal = () => {
        deleteModalRef.current?.showModal()
    }

    const hideDeleteModal = () => {
        deleteModalRef.current?.close()
    }

    const handleDelete = async () => {
        await deleteColumn(boardId as string, column.id)
    }

    return (
        <>
            <div
                style={style}
                ref={setNodeRef}
                className={`flex flex-col items-center justify-center gap-4 w-80 bg-slate-300 p-4 ${isDragging ? 'opacity-50' : ''}`}>
                <div
                    {...attributes}
                    {...listeners}
                >drag
                </div>
                <h2 className='text-center font-bold'>{column.name}</h2>
                <div className='flex justify-center gap-2'>
                    <button onClick={() => editColumn(boardId as string, column.id, columnName, "name")}
                            className='bg-white rounded-md px-2'>Rename
                    </button>
                    <button onClick={showDeleteModal}
                            className='bg-white rounded-md px-2'>Delete
                    </button>
                </div>
                <div className='w-full flex gap-2 justify-center'>
                    <input type='text' value={taskName} onChange={(e) => setTaskName(e.target.value)}
                           className='bg-white flex-shrink'/>
                    <button onClick={() => addTask(boardId as string, column.id, taskName)}
                            className='bg-white rounded-md px-2'>add
                    </button>
                </div>
                <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                    <div ref={setDroppableRef} className="w-full bg-white min-h-56">
                        {tasks.map((task) => (
                            <Task key={task.id} task={task} boardId={boardId} column={column} taskName={taskName}/>
                        ))}
                    </div>
                </SortableContext>
            </div>

            <Modal ref={deleteModalRef}>
                <ModalHeader>Are you sure you want to delete this column?</ModalHeader>
                <ModalMessage>This column along with its respective tasks will be deleted. This action cannot be
                    undone.</ModalMessage>
                <div className='w-full flex justify-end gap-2 mt-4'>
                    <button onClick={hideDeleteModal}
                            className='border-gray-300 border-1 px-6 py-1 rounded text-sm hover:bg-gray-100'>Cancel
                    </button>
                    <button onClick={handleDelete}
                            className='bg-red-500 px-6 py-1 rounded text-white text-sm hover:bg-red-600'>Delete
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default Column

export const ColumnPreview = ({column}) => {
    return (
        <div className="p-2 rounded-md shadow-md flex flex-col items-center gap-2 bg-slate-200">
            <h1>{column.name}</h1>
            <div className="w-full bg-white min-h-56 flex flex-col gap-4">
                {column.tasks.map(task =>
                    <TaskPreview key={task.id} task={task}/>
                )}
            </div>
        </div>
    )
}