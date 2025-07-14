import { useDroppable } from "@dnd-kit/core"
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { deleteColumn, editColumn } from "../firebase/firestore/columns.ts"
import { addTask } from "../firebase/firestore/tasks.ts"
import Task from "./Task.tsx"
import type { Column } from "../types/types.ts"

const Column = ({column, tasks, boardId, columnName, taskName, setTaskName}: {column: Column}) => {
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
        id: column.id,
        data: {
            type: 'column'
        }
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
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
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                <div ref={setDroppableRef} className="w-full bg-white min-h-56">
                    {tasks
                        .filter((task) => task.columnId === column.id)
                        .map((task) => (
                            <Task key={task.id} task={task} boardId={boardId} column={column} taskName={taskName}/>
                        ))}
                </div>
            </SortableContext>
        </div>

    )
}

export default Column