import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext.tsx"
import { handleSignOut } from "../firebase/auth.ts"
import {createBoard, getBoardsByUser, deleteBoard, renameBoard} from "../firebase/firestore/boards.ts"
import { useNavigate } from "react-router-dom"
import type { Board } from "../types/types.ts"

const Dashboard = () => {
    const [boards, setBoards] = useState<Board[]>([])
    const [boardTitle, setBoardTitle] = useState<string>('')
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBoards = async () => {
            if (user) {
                const userBoards = await getBoardsByUser(user.uid)
                setBoards(userBoards)
            }
        }
        fetchBoards()
    }, [user]);

    const handleAddBoard = async () => {
        if (user) {
            await createBoard(user.uid, boardTitle)
        }
        //navigate to the new board or update the UI accordingly
    }

    const boardElements = boards.map(board => (
        <div key={board.id} className='bg-white text-black p-4 rounded-lg'>
            <h2 className='text-lg font-bold'>{board.name}</h2>
            <p>Created at: {board.createdAt?.toDate().toLocaleString()}</p>
            <div className='flex flex-col gap-2'>
                <button onClick={() => navigate(board.id)}>Open</button>
                <button onClick={() => deleteBoard(board.id)}>Delete</button>
                <button onClick={() => renameBoard(board.id, boardTitle)}>Rename</button>
            </div>
        </div>
    ))

    return (
        <div className='flex flex-col items-center gap-10 max-w-xl bg-slate-500 mx-auto text-white'>
            <h1>Welcome {user?.email}</h1>
            <input
                type='text'
                value={boardTitle}
                onChange={e => setBoardTitle(e.target.value)}
                className='bg-white text-black p-2 rounded-lg'
            />
            <div className='w-full flex justify-start px-4'>
                <button onClick={handleAddBoard} className='bg-white rounded-lg aspect-square w-28 text-black'>
                    Add Board
                </button>
            </div>
            <div>
                {boardElements.length > 0 ?
                    boardElements :
                    <p>No boards available. Create one to get started!</p>}
            </div>
            <button onClick={handleSignOut}>Log Out</button>
        </div>
    )
}

export default Dashboard