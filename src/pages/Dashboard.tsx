import {useState, useEffect, useRef} from "react"
import {useAuth} from "../contexts/AuthContext.tsx"
import {handleSignOut} from "../firebase/auth.ts"
import {createBoard, getBoardsByUser, deleteBoard} from "../firebase/firestore/boards.ts"
import {useNavigate} from "react-router-dom"
import type {Board} from "../types/types.ts"
import {collection, onSnapshot, where, query} from "firebase/firestore"
import {db} from "../firebase/firebase.ts"
import Modal from "../components/modal/Modal.tsx"
import ModalMessage from "../components/modal/ModalMessage.tsx"
import ModalHeader from "../components/modal/ModalHeader.tsx"
import {IoIosAdd} from "react-icons/io"

const Dashboard = () => {
    const [boards, setBoards] = useState<Board[]>([])
    const addModalRef = useRef<HTMLDialogElement | null>(null)
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

    const showAddModal = () => {
        addModalRef.current?.showModal()
    }

    const hideAddModal = () => {
        addModalRef.current?.close()
    }

    const handleAdd = async (data) => {
        hideAddModal()
        const {name, option} = Object.fromEntries(data)
        const includeDefaults = option === 'on'

        if (user) await createBoard(user.uid, name, includeDefaults)
    }

    const boardElements = boards.map(board => (
        <div key={board.id} className='bg-white text-black p-4 rounded-lg'>
            <h2 className='text-lg font-bold'>{board.name}</h2>
            <p>Created at: {board.createdAt?.toDate().toLocaleString()}</p>
            <div className='flex flex-col gap-2'>
                <button onClick={() => navigate(board.id)}>Open</button>
                <button id={board.id} onClick={showDeleteModal}>Delete</button>
            </div>
        </div>
    ))

    return (
        <>
            <div className='flex flex-col items-center gap-10 max-w-xl bg-slate-500 mx-auto text-white'>
                <h1>Welcome {user?.email}</h1>
                <div className='w-full flex justify-start px-4'>
                    <button onClick={showAddModal} className='bg-white rounded-full aspect-square text-gray-600 text-lg p-4'>
                        <IoIosAdd />
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

            <Modal ref={addModalRef} onClose={hideAddModal}>
                <ModalHeader>Board details</ModalHeader>
                <ModalMessage>Enter board details below.</ModalMessage>
                <form action={handleAdd} className='w-full flex flex-col gap-3 mt-4'>
                    <div className='flex flex-col'>
                        <label htmlFor='name' className='text-sm'>Name</label>
                        <input id='name' name='name' className='px-2 text-gray-600 border-gray-300 border rounded'
                               required/>
                    </div>
                    <div className='flex justify-start gap-1'>
                        <input type='checkbox' id='option' name='option' defaultChecked className='border-1 border-gray-300'/>
                        <label htmlFor='option' className='text-xs text-gray-600'>Generate default columns</label>
                    </div>
                    <div className='w-full flex justify-end gap-2 mt-4'>
                        <button onClick={hideAddModal} type='button'
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

export default Dashboard