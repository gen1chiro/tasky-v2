import { useDraggable } from "@dnd-kit/core";
import { deleteTask, editTask } from "../firebase/firestore/tasks.ts";


const Task = ({task, boardId, column, taskName}) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.columnId,
    })

    const style = transform
        ? {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
        }
        : undefined

    return (
        <div key={task.id}
             style={style}
             ref={setNodeRef}
             {...attributes}
             {...listeners}
        >
            <h1>{task.name}</h1>
            <button onClick={() => deleteTask(boardId, column.id, task.id)}>delete
            </button>
            <button
                onClick={() => editTask(boardId, column.id, task.id, taskName, "name")}>rename
            </button>
        </div>
    )
}

export default Task