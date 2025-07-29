import {useRef} from "react";
import {useSortable} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {deleteTask, editTask} from "../firebase/firestore/tasks.ts"
import Modal from "./modal/Modal.tsx"
import ModalHeader from "./modal/ModalHeader.tsx"
import ModalMessage from "./modal/ModalMessage.tsx"
import {formatDate, formatPriority} from "../utils/taskUtils.ts"
import {CiFlag1} from "react-icons/ci"

const Task = ({task, boardId}) => {
    const deleteModalRef = useRef<HTMLDialogElement | null>(null)
    const date = formatDate(task.dueDate)
    const priority = formatPriority(task.priority)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            columnId: task.columnId,
        }
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
        await deleteTask(boardId, task.columnId, task.id)
    }

    return (
        <>
            <div className='w-full flex flex-col bg-white px-4 py-2 border border-gray-300 rounded-lg shadow'>
                <div
                    ref={setNodeRef}
                    style={style}
                    {...attributes}
                    {...listeners}
                    className={`flex flex-col gap-1 ${isDragging ? 'opacity-50' : ''}`}
                >
                    <h1 className='w-full text-left font-semibold text-sm'>{task.name}</h1>
                    {task.description
                        && <p className='w-full text left text-gray-600 text-sm break-words line-clamp-2'>{task.description}</p>
                    }
                    <div className='w-full flex justify-start items-center gap-2 text-gray-600 text-sm mt-2'>
                        <CiFlag1/>
                        <p>{date}</p>
                        <p className={`ml-auto px-3 rounded-full ${priority}`}>{task.priority}</p>
                    </div>
                </div>
                {/*
                <button onClick={showDeleteModal}>delete</button>
                <button
                    onClick={() => editTask(boardId, task.columnId, task.id, taskName, "name")}>edit
                </button>
                */}
            </div>
            <Modal ref={deleteModalRef}>
                <ModalHeader>Are you sure you want to delete this task?</ModalHeader>
                <ModalMessage>This action cannot be undone.</ModalMessage>
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

export default Task

export const TaskPreview = ({task}) => {
    const date = formatDate(task.dueDate)
    const priority = formatPriority(task.priority)

    return (
        <div className='flex flex-col gap-1 w-full bg-white px-4 py-2 border border-gray-300 rounded-lg shadow'>
            <h1 className='w-full text-left font-semibold text-sm'>{task.name}</h1>
            {task.description
                && <p className='w-full text left text-gray-600 text-sm truncate'>{task.description}</p>
            }
            <div className='w-full flex justify-start items-center gap-2 text-gray-600 text-sm mt-2'>
                <CiFlag1/>
                <p>{date}</p>
                <p className={`ml-auto px-3 rounded-full ${priority}`}>{task.priority}</p>
            </div>
        </div>
    )
}