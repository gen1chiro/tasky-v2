import { useDroppable } from "@dnd-kit/core"
import { deleteColumn, renameColumn } from "../firebase/firestore/columns.ts"
import { addTask } from "../firebase/firestore/tasks.ts"
import Task from "./Task.tsx"


const Column = ({column, tasks, boardId, columnName, taskName, setTaskName}) => {
    const { setNodeRef } = useDroppable({
        id: column.id
    })

    return (
        <div className='flex flex-col items-center justify-center gap-4 w-80 bg-slate-300 p-4'>
            <h2 className='text-center font-bold'>{column.name}</h2>
            <div className='flex justify-center gap-2'>
                <button onClick={() => renameColumn(boardId as string, column.id, columnName)}
                        className='bg-white rounded-md px-2'>Rename
                </button>
                <button onClick={() => deleteColumn(boardId as string, column.id)}
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
            <div ref={setNodeRef} className="w-full bg-white min-h-80">
                {tasks
                    .filter((task) => task.columnId === column.id)
                    .map((task) => (
                        <Task task={task} boardId={boardId} column={column} taskName={taskName}/>
                    ))}
            </div>
        </div>
    )
}

export default Column