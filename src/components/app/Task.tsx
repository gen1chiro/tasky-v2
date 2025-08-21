import {useRef} from "react";
import {useSortable} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {deleteTask} from "../../firebase/firestore/tasks.ts"
import Modal from "./modal/Modal.tsx"
import ModalHeader from "./modal/ModalHeader.tsx"
import ModalMessage from "./modal/ModalMessage.tsx"
import {formatDate, formatPriority} from "../../utils/taskUtils.ts"
import {CiFlag1} from "react-icons/ci"
import {RxDragHandleDots2} from "react-icons/rx"
import TaskModal from "./modal/TaskModal.tsx"
import {MdDelete} from "react-icons/md"

const Task = ({task, boardId}) => {
    const deleteModalRef = useRef<HTMLDialogElement | null>(null)
    const taskModalRef = useRef<HTMLDialogElement | null>(null)
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
        hideTaskModal()
        deleteModalRef.current?.showModal()
    }

    const hideDeleteModal = () => {
        deleteModalRef.current?.close()
    }

    const handleDelete = async () => {
        await deleteTask(boardId, task.columnId, task.id)
    }

    const showTaskModal = () => {
        taskModalRef.current?.showModal()
    }

    const hideTaskModal = () => {
        taskModalRef.current?.close()
    }

    return (
        <>
            <div className='w-full flex flex-col bg-white px-4 py-2 border border-gray-300 rounded-lg shadow' onClick={showTaskModal}>
                <div
                    ref={setNodeRef}
                    style={style}
                    className={`flex flex-col gap-1 ${isDragging ? 'opacity-50' : ''}`}
                >
                    <div className='w-full flex justify-between items-center'>
                        <h1 className='w-full text-left font-semibold text-sm'>{task.name}</h1>
                        <div
                            {...attributes}
                            {...listeners}
                            className='cursor-grab'
                        >
                            <RxDragHandleDots2 />
                        </div>
                    </div>
                    {task.description
                        && <p className='w-full text left text-gray-600 text-sm break-words line-clamp-2'>{task.description}</p>
                    }
                    <div className='w-full flex justify-start items-center gap-2 text-gray-600 text-sm mt-2'>
                        <CiFlag1/>
                        <p>{date}</p>
                        <p className={`ml-auto px-3 rounded-full ${priority}`}>{task.priority}</p>
                    </div>
                </div>
            </div>

            <Modal ref={deleteModalRef} onClose={hideDeleteModal}>
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

            <TaskModal ref={taskModalRef} task={task} boardId={boardId} hide={hideTaskModal}>
                <div className='w-full flex justify-between items-center'>
                    <h1 className='font-semibold text-md'>Task Details</h1>
                    <button onClick={showDeleteModal} className='rounded-full hover:bg-gray-100 p-1'>
                        <MdDelete className='text-xl text-gray-600'/>
                    </button>
                </div>
            </TaskModal>
        </>
    )
}

export default Task

export const TaskPreview = ({task}) => {
    const date = formatDate(task.dueDate)
    const priority = formatPriority(task.priority)

    return (
        <div className='flex flex-col gap-1 w-full bg-white px-4 py-2 border border-gray-300 rounded-lg shadow'>
            <div className='w-full flex justify-between items-center'>
                <h1 className='w-full text-left font-semibold text-sm'>{task.name}</h1>
                <div>
                    <RxDragHandleDots2/>
                </div>
            </div>
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