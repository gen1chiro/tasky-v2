import {useState, useEffect, useRef} from "react"
import {useAuth} from "../contexts/AuthContext.tsx"
import {handleSignOut} from "../firebase/auth.ts"
import {createBoard, getBoardsByUser, deleteBoard, renameBoard} from "../firebase/firestore/boards.ts"
import {useNavigate} from "react-router-dom"
import type {Board} from "../types/types.ts"
import {collection, onSnapshot, where, query} from "firebase/firestore"
import {db} from "../firebase/firebase.ts"
import Modal from "../components/modal/Modal.tsx"
import ModalMessage from "../components/modal/ModalMessage.tsx"
import ModalHeader from "../components/modal/ModalHeader.tsx"

const Dashboard = () => {
    const [boards, setBoards] = useState<Board[]>([])
    const [boardTitle, setBoardTitle] = useState<string>('')
    const deleteModalRef = useRef<HTMLDialogElement | null>(null)
    const {user} = useAuth()
    const navigate = useNavigate()
    let activeBoardId = ''

    useEffect(() => {
        const fetchBoards = async () => {
            if (user) {
                const userBoards = await getBoardsByUser(user.uid)
                setBoards(userBoards)
            }
        }
        fetchBoards()
    }, [user])

    useEffect(() => {
        const boardsCollectionRef = collection(db, 'boards')
        const boardsQuery = query(boardsCollectionRef, where('owner', '==', user?.uid))

        const unsubscribe = onSnapshot(boardsQuery, (snapshot) => {
            const updatedBoards = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setBoards(updatedBoards as Board[])
        })

        return () => unsubscribe()
    }, [user])

    const handleAddBoard = async () => {
        if (user) {
            await createBoard(user.uid, boardTitle)
        }
    }

    const showDeleteModal = (e) => {
        deleteModalRef.current?.showModal()
        activeBoardId = e.target.id
    }

    const hideDeleteModal = () => {
        deleteModalRef.current?.close()
    }

    const handleDelete = async () => {
        hideDeleteModal()
        await deleteBoard(activeBoardId)
    }

    const boardElements = boards.map(board => (
        <div key={board.id} className='bg-white text-black p-4 rounded-lg'>
            <h2 className='text-lg font-bold'>{board.name}</h2>
            <p>Created at: {board.createdAt?.toDate().toLocaleString()}</p>
            <div className='flex flex-col gap-2'>
                <button onClick={() => navigate(board.id)}>Open</button>
                <button id={board.id} onClick={showDeleteModal}>Delete</button>
                <button onClick={() => renameBoard(board.id, boardTitle)}>Rename</button>
            </div>
        </div>
    ))

    return (
        <>
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

            <Modal ref={deleteModalRef} onClose={hideDeleteModal}>
                <ModalHeader>Are you sure you want to delete this board?</ModalHeader>
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
        </>
    )
}

export default Dashboard