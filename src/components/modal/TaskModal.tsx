import {useState} from "react"
import Modal from "./Modal.tsx"
import {MdModeEditOutline} from "react-icons/md"
import {editTask} from "../../firebase/firestore/tasks.ts"

const TaskModal = ({children, ref, task, hide, boardId}) => {
    const [taskName, setTaskName] = useState<string>(task.name)
    const [taskDescription, setTaskDescription] = useState<string>(task.description)
    const [taskDueDate, setTaskDueDate] = useState<string>(task.dueDate)
    const [taskPriority, setTaskPriority] = useState<string>(task.priority)
    const [isEditingName, setIsEditingName] = useState<boolean>(false)
    const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false)
    const [isEditingDueDate, setIsEditingDueDate] = useState<boolean>(false)
    const [isEditingPriority, setIsEditingPriority] = useState<boolean>(false)
    const edited =
        taskName !== task.name ||
        taskDescription !== task.description ||
        taskDueDate !== task.dueDate ||
        taskPriority !== task.priority

    const handleCancel = () => {
        setTaskName(task.name)
        setTaskDescription(task.description)
        setTaskDueDate(task.dueDate)
        setTaskPriority(task.priority)
        hide()
    }

    const handleSave = async () => {
        hide()
        const updates = []

        if (taskName !== task.name) updates.push(editTask(boardId, task.columnId, task.id, taskName, 'name'))
        if (taskDescription !== task.description) updates.push(editTask(boardId, task.columnId, task.id, taskDescription, 'description'))
        if (taskDueDate !== task.dueDate) updates.push(editTask(boardId, task.columnId, task.id, taskDueDate, 'dueDate'))
        if (taskPriority !== task.priority) updates.push(editTask(boardId, task.columnId, task.id, taskPriority, 'priority'))

        await Promise.all(updates)
    }

    return (
        <Modal ref={ref} onClose={hide}>
            {children}
            <div className='w-full flex flex-col gap-3'>
                <div>
                    <p className='text-xs text-gray-600'>Name</p>
                    <div
                        className='w-full flex justify-between items-center border border-white hover:border-gray-300 rounded-md px-2 group'
                        onClick={() => setIsEditingName(true)}
                        onBlur={() => setIsEditingName(false)}
                    >
                        {isEditingName
                            ? <input
                                type='text'
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                className='w-full focus:outline-none focus:ring-0'
                                autoFocus
                            />
                            :
                            <>
                                <h1>{taskName}</h1>
                                <MdModeEditOutline className='hidden group-hover:block text-gray-600'/>
                            </>
                        }
                    </div>
                </div>
                <div>
                    <p className='text-xs text-gray-600'>Description</p>
                    <div
                        className='w-full flex justify-between items-center border border-white hover:border-gray-300 rounded-md px-2 group'
                        onClick={() => setIsEditingDescription(true)}
                        onBlur={() => setIsEditingDescription(false)}
                    >
                        {isEditingDescription
                            ? <textarea
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                className='w-full focus:outline-none focus:ring-0 resize-none'
                                rows={2}
                                autoFocus
                            />
                            :
                            <>
                                <h1>{taskDescription}</h1>
                                <MdModeEditOutline className='hidden group-hover:block text-gray-600'/>
                            </>
                        }
                    </div>
                </div>
                <div>
                    <p className='text-xs text-gray-600'>Due Date</p>
                    <div
                        className='w-full flex justify-between items-center border border-white hover:border-gray-300 rounded-md px-2 group'
                        onClick={() => setIsEditingDueDate(true)}
                        onBlur={() => setIsEditingDueDate(false)}
                    >
                        {isEditingDueDate
                            ? <input
                                type='date'
                                value={taskDueDate}
                                onChange={(e) => setTaskDueDate(e.target.value)}
                                className='w-full focus:outline-none focus:ring-0'
                                autoFocus
                            />
                            :
                            <>
                                <h1>{taskDueDate}</h1>
                                <MdModeEditOutline className='hidden group-hover:block text-gray-600'/>
                            </>
                        }
                    </div>
                </div>
                <div>
                    <p className='text-xs text-gray-600'>Priority</p>
                    <div
                        className='w-full flex justify-between items-center border border-white hover:border-gray-300 rounded-md px-2 group'
                        onClick={() => setIsEditingPriority(true)}
                        onBlur={() => setIsEditingPriority(false)}
                    >
                        {isEditingPriority
                            ? <select
                                value={taskPriority}
                                onChange={(e) => setTaskPriority(e.target.value)}
                                className='w-full focus:outline-none focus:ring-0'
                                autoFocus
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            :
                            <>
                                <h1>{taskPriority}</h1>
                                <MdModeEditOutline className='hidden group-hover:block text-gray-600'/>
                            </>
                        }
                    </div>
                </div>
                {edited && (
                    <div className='w-full flex justify-end gap-2 mt-4'>
                        <button
                            onClick={handleCancel}
                            className='border-gray-300 border-1 px-6 py-1 rounded text-sm hover:bg-gray-100'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className='bg-black px-6 py-1 rounded text-white text-sm hover:bg-zinc-800'
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default TaskModal