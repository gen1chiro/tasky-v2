import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {renameBoard} from "../firebase/firestore/boards.ts"

const BoardHeader = ({boardName, boardId}) => {
    const [name, setName] = useState<string>(boardName)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const navigate = useNavigate()

    return (
        <header className='flex gap-4 p-4 border border-gray-200'>
            <button onClick={() => navigate('/app')}>HOME</button>
            {
                isEditing ? (
                    <input
                        className='w-fit focus:outline-none focus:ring-1 focus:ring-gray-500 rounded'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={async () => {
                            setIsEditing(false)
                            await renameBoard(boardId, name)
                        }}
                        autoFocus
                    />
                ) : (
                    <h1 onDoubleClick={() => setIsEditing(true)}>{name}</h1>
                )
            }
        </header>
    )
}

export default BoardHeader