import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { deleteTask, editTask } from "../firebase/firestore/tasks.ts"

const Task = ({task, boardId, taskName}) => {
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

    return (
        <div >
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className={`p-2 rounded-md shadow-md flex flex-col items-center gap-2 bg-slate-200 ${isDragging ? 'opacity-50' : ''}`}
            >
                <h1>{task.name}</h1>
            </div>
            <button onClick={() => deleteTask(boardId, task.columnId, task.id)}>delete
            </button>
            <button
                onClick={() => editTask(boardId, task.columnId, task.id, taskName, "name")}>rename
            </button>
        </div>
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