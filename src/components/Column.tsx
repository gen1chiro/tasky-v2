import {useState, useRef, useEffect} from "react";
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
import {IoIosAdd} from "react-icons/io"
import {SlOptionsVertical} from "react-icons/sl"
import { MdDelete, MdModeEditOutline } from "react-icons/md"

const Column = ({column, tasks, boardId}: { column: Column }) => {
    const [showColumnPopover, setShowColumnPopover] = useState<boolean>(false)
    const popoverRef = useRef<HTMLDivElement | null>(null)
    const deleteModalRef = useRef<HTMLDialogElement | null>(null)
    const addTaskRef = useRef<HTMLDialogElement | null>(null)
    const editModalRef = useRef<HTMLDialogElement | null>(null)

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

    const showEditModal = () => {
        editModalRef.current?.showModal()
    }

    const hideEditModal = () => {
        editModalRef.current?.close()
    }

    const handleEdit = async (data) => {
        hideEditModal()
        const columnName = data.get('name')
        await editColumn(boardId as string, column.id, columnName, "name")
    }

    const showAddTaskModal = () => {
        addTaskRef.current?.showModal()
    }

    const hideAddTaskModal = () => {
        addTaskRef.current?.close()
    }

    const handleAddTask = async (data) => {
        hideAddTaskModal()
        const task = Object.fromEntries(data)
        await addTask(boardId as string, column.id, task)
    }

    const toggleColumnPopover = () => {
        setShowColumnPopover(prev => !prev)
    }

    const hideColumnPopover = () => {
        setShowColumnPopover(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current?.contains(event.target as Node)) {
                hideColumnPopover()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <>
            <div
                style={style}
                ref={setNodeRef}
                className={`flex flex-col items-center gap-4 min-w-sm max-w-sm bg-slate-100 p-3 rounded-xl ${isDragging ? 'opacity-50' : ''}`}>
                <div className='w-full flex items-center justify-between'>
                    <div className='flex items-center gap-2 flex-grow hover:cursor-grab'
                         {...attributes}
                         {...listeners}
                    >
                        <h2 className='text-center'>{column.name}</h2>
                        <div className='flex justify-center items-center rounded-full bg-blue-600 w-5 aspect-square'>
                            <h1 className='text-white text-xs'>{tasks.length}</h1>
                        </div>
                    </div>
                    <div className='flex items-center relative'>
                        <button onClick={showAddTaskModal} className='rounded-full p-1 hover:bg-slate-200'>
                            <IoIosAdd className='text-gray-600 text-xl'/>
                        </button>
                        <button onClick={toggleColumnPopover} className='rounded-full p-1 hover:bg-slate-200'>
                            <SlOptionsVertical className='text-gray-600 text-sm'/>
                        </button>
                        {showColumnPopover && (
                            <div
                                className='absolute right-0 top-full bg-white shadow-md rounded-md border border-gray-300 w-40 z-10 text-gray-600 text-sm'
                                ref={popoverRef}
                            >
                                <button onClick={showDeleteModal}
                                        className='w-full text-left px-2 py-1 hover:bg-gray-100 flex items-center gap-1'>
                                    <MdDelete />
                                    Delete
                                </button>
                                <button onClick={showEditModal}
                                        className='w-full text-left px-2 py-1 hover:bg-gray-100 flex items-center gap-1'>
                                    <MdModeEditOutline />
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                    <div ref={setDroppableRef} className="w-full flex flex-col gap-2 min-h-56">
                        {tasks.map((task) => (
                            <Task key={task.id} task={task} boardId={boardId}/>
                        ))}
                    </div>
                </SortableContext>
            </div>

            <Modal ref={deleteModalRef} onClose={hideDeleteModal}>
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

            <Modal ref={editModalRef} onClose={hideEditModal}>
                <ModalHeader>Edit Column</ModalHeader>
                <ModalMessage>Enter the new column name below.</ModalMessage>
                <form action={handleEdit} className='w-full flex flex-col gap-3 mt-4'>
                    <div className='flex flex-col'>
                        <label htmlFor='name' className='text-sm'>Column Name</label>
                        <input id='name' name='name' className='px-2 text-gray-600 border-gray-300 border rounded'
                               required/>
                    </div>
                    <div className='w-full flex justify-end gap-2 mt-4'>
                        <button onClick={hideEditModal} type='button'
                                className='border-gray-300 border-1 px-6 py-1 rounded text-sm hover:bg-gray-100'>Cancel
                        </button>
                        <button
                            className='bg-black px-6 py-1 rounded text-white text-sm hover:bg-zinc-800'>Save
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal ref={addTaskRef} onClose={hideAddTaskModal}>
                <ModalHeader>Task Details</ModalHeader>
                <ModalMessage>Enter you task details below.</ModalMessage>
                <form action={handleAddTask} className='w-full flex flex-col gap-3 mt-4'>
                    <div className='flex flex-col'>
                        <label htmlFor='name' className='text-sm'>Task Name</label>
                        <input id='name' name='name' className='px-2 text-gray-600 border-gray-300 border rounded'
                               required/>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='description' className='text-sm'>Task Description</label>
                        <textarea id='description' name='description'
                                  className='resize-none h-16 px-2 text-gray-600 border-gray-300 border rounded'/>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='date' className='text-sm'>Due Date</label>
                        <input id='date' name='date' type='date'
                               className='px-2 text-gray-600 border-gray-300 border rounded'/>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='priority' className='text-sm'>Priority Level</label>
                        <select id='priority' name='priority'
                                className='px-2 text-gray-600 border-gray-300 border rounded'>
                            <option value='Low'>Low</option>
                            <option value='Medium'>Medium</option>
                            <option value='High'>high</option>
                        </select>
                    </div>
                    <div className='w-full flex justify-end gap-2 mt-4'>
                        <button onClick={hideAddTaskModal} type='button'
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

export default Column

export const ColumnPreview = ({column}) => {
    return (
        <div className="flex flex-col items-center gap-4 min-w-sm max-w-sm bg-slate-100 p-3 rounded-xl shadow-md">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-center">{column.name}</h2>
                    <div className="flex justify-center items-center rounded-full bg-blue-600 w-5 aspect-square">
                        <h1 className="text-white text-xs">{column.tasks.length}</h1>
                    </div>
                </div>
                <div className="flex items-center">
                    <button className="rounded-full p-1">
                        <IoIosAdd className="text-gray-600 text-xl"/>
                    </button>
                    <button className="rounded-full p-1">
                        <SlOptionsVertical className="text-gray-600 text-sm"/>
                    </button>
                </div>
            </div>
            <div className="w-full flex flex-col gap-2 min-h-56">
                {column.tasks.map((task) => (
                    <TaskPreview key={task.id} task={task}/>
                ))}
            </div>
        </div>
    )
}