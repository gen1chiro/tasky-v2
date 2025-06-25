import { useState } from "react"
import { useLoaderData, useParams } from "react-router-dom"
import {addColumn, deleteColumn, renameColumn} from "../firebase/firestore/boards.ts";

const BoardPage = () => {
    const [columnName, setColumnName] = useState<string>('')
    const columns = useLoaderData()
    const { boardId } = useParams<{ boardId: string }>()

    const columnElements = columns.map((column) => {
        return (
            <div key={column.id}>
                <h2>{column.name}</h2>
                <div className='flex flex-col gap-2'>
                    <button onClick={() => renameColumn(boardId as string, column.id, columnName)}>Rename</button>
                    <button onClick={() => deleteColumn(boardId as string, column.id)}>Delete</button>
                </div>
            </div>
        )
    })

    return (
        <div>
            <h1>Board</h1>
            <input type='text' value={columnName} onChange={(e) => setColumnName(e.target.value)} className='border-black border'/>
            <button onClick={() => addColumn(boardId as string, columnName)}>Add</button>
            <div className='flex gap-4'>
                {columnElements}
            </div>
        </div>
    )
}

export default BoardPage