import {useRef} from "react";
import {useSortable} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {deleteTask, editTask} from "../firebase/firestore/tasks.ts"
import Modal from "./modal/Modal.tsx"
import ModalHeader from "./modal/ModalHeader.tsx"
import ModalMessage from "./modal/ModalMessage.tsx"

const Task = ({task, boardId}) => {
    const deleteModalRef = useRef<HTMLDialogElement | null>(null)

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
            <div>
                <div
                    ref={setNodeRef}
                    style={style}
                    {...attributes}
                    {...listeners}
                    className={`p-2 rounded-md shadow-md flex flex-col items-center gap-2 bg-slate-200 ${isDragging ? 'opacity-50' : ''}`}
                >
                    <h1>{task.name}</h1>
                    <p>{task.description}</p>
                    <p>{task.priority}</p>
                    <p>{task.dueDate}</p>
                </div>
                <button onClick={showDeleteModal}>delete</button>
                <button
                    /*onClick={() => editTask(boardId, task.columnId, task.id, taskName, "name")}*/>edit
                </button>
            </div>
            <Modal ref={deleteModalRef}>
                <ModalHeader>Are you sure you want to delete this task?</ModalHeader>
                <ModalMessage>This action cannot be undone.</ModalMessage>
                <div className='w-full flex justify-end gap-2 mt-4'>
                    <button onClick={hideDeleteModal} className='border-gray-300 border-1 px-6 py-1 rounded text-sm hover:bg-gray-100'>Cancel</button>
                    <button onClick={handleDelete} className='bg-red-500 px-6 py-1 rounded text-white text-sm hover:bg-red-600'>Delete</button>
                </div>
            </Modal>
        </>
    )
}

export default Task

export const TaskPreview = ({task}) => {
    return (
        <div className="p-2 rounded-md shadow-md flex flex-col items-center gap-2 bg-slate-200">
            <h1>{task.name}</h1>
        </div>
    )
}