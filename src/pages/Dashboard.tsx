import {useState, useEffect, useRef} from "react"
import {useAuth} from "../contexts/AuthContext.tsx"
import {handleSignOut} from "../firebase/auth.ts"
import {createBoard, getBoardsByUser, deleteBoard} from "../firebase/firestore/boards.ts"
import type {Board} from "../types/types.ts"
import {collection, onSnapshot, where, query} from "firebase/firestore"
import {db} from "../firebase/firebase.ts"
import Modal from "../components/modal/Modal.tsx"
import ModalMessage from "../components/modal/ModalMessage.tsx"
import ModalHeader from "../components/modal/ModalHeader.tsx"
import BoardTile from "../components/BoardTile.tsx"
import {IoIosAdd} from "react-icons/io"

const Dashboard = () => {
    const [boards, setBoards] = useState<Board[]>([])
    const addModalRef = useRef<HTMLDialogElement | null>(null)
    const deleteModalRef = useRef<HTMLDialogElement | null>(null)
    const {user} = useAuth()
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

    const showDeleteModal = (id) => {
        deleteModalRef.current?.showModal()
        activeBoardId = id
        console.log(activeBoardId)
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
        const {name, color, option} = Object.fromEntries(data)
        const includeDefaults = option === 'on'

        if (user) await createBoard(user.uid, name, includeDefaults, color)
    }

    const boardElements = boards.map(board => (
        <BoardTile key={board.id} board={board} showModal={showDeleteModal}/>
    ))

    console.log(boards)

    return (
        <>
            <main className='w-11/12 max-w-7xl h-screen mx-auto text-white p-4 transition-colors duration-200'>
                <div className='w-full flex justify-between items-center border-b border-gray-300 py-6'>
                    <div className='flex items-center gap-6'>
                        <h1 className='text-black font-bold text-3xl'>Boards</h1>
                        <button onClick={showAddModal}
                                className='flex justify-center items-center gap-2 pr-3 pl-1 py-1 bg-blue-600 hover:bg-blue-500 rounded'>
                            <IoIosAdd className='text-lg font-bold'/>
                            <span className='text-sm'>New board</span>
                        </button>
                    </div>
                    <button onClick={handleSignOut}
                            className='bg-black px-3 py-1 rounded text-sm hover:bg-zinc-800'>
                        Log Out
                    </button>
                </div>
                <div className='flex items-center gap-2 mt-8 mb-4'>
                    <p className='text-black text-lg'>Owned Boards</p>
                    <div className="flex justify-center items-center rounded-full bg-blue-600 w-5 aspect-square">
                        <h1 className="text-white text-sm">{boards.length}</h1>
                    </div>
                </div>
                {boardElements.length > 0
                    ? <div
                        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5  gap-4 flex-wrap'>{boardElements}</div>
                    : <div className='text-gray-600 w-full h-5/6 flex items-center justify-center'>No boards available.
                        Create one to get started!</div>
                }
                <div className='flex items-center gap-2 mt-8 mb-4'>
                    <p className='text-black text-lg'>Team Boards</p>
                    <div className="flex justify-center items-center rounded-full bg-blue-600 w-5 aspect-square">
                        <h1 className="text-white text-sm">0</h1>
                    </div>
                </div>
            </main>

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
                    <div className='flex flex-col'>
                        <h1 className='text-sm'>Color</h1>
                        <div className="flex gap-2">
                            <input
                                type="radio"
                                id="color-blue"
                                name="color"
                                value="blue"
                                defaultChecked
                                className="sr-only peer/blue"
                            />
                            <label
                                htmlFor="color-blue"
                                className="w-6 h-6 rounded-full bg-blue-300 border-2 border-gray-200 cursor-pointer hover:border-gray-600 transition-colors peer-checked/blue:border-gray-600"
                            ></label>

                            <input
                                type="radio"
                                id="color-green"
                                name="color"
                                value="green"
                                className="sr-only peer/green"
                            />
                            <label
                                htmlFor="color-green"
                                className="w-6 h-6 rounded-full bg-green-300 border-2 border-gray-200 cursor-pointer hover:border-gray-600 transition-colors peer-checked/green:border-gray-600"
                            ></label>

                            <input
                                type="radio"
                                id="color-red"
                                name="color"
                                value="red"
                                className="sr-only peer/red"
                            />
                            <label
                                htmlFor="color-red"
                                className="w-6 h-6 rounded-full bg-red-300 border-2 border-gray-200 cursor-pointer hover:border-gray-600 transition-colors peer-checked/red:border-gray-600"
                            ></label>

                            <input
                                type="radio"
                                id="color-purple"
                                name="color"
                                value="purple"
                                className="sr-only peer/purple"
                            />
                            <label
                                htmlFor="color-purple"
                                className="w-6 h-6 rounded-full bg-purple-300 border-2 border-gray-200 cursor-pointer hover:border-gray-600 transition-colors peer-checked/purple:border-gray-600"
                            ></label>

                            <input
                                type="radio"
                                id="color-orange"
                                name="color"
                                value="orange"
                                className="sr-only peer/orange"
                            />
                            <label
                                htmlFor="color-orange"
                                className="w-6 h-6 rounded-full bg-orange-300 border-2 border-gray-200 cursor-pointer hover:border-gray-600 transition-colors peer-checked/orange:border-gray-600"
                            ></label>

                            <input
                                type="radio"
                                id="color-pink"
                                name="color"
                                value="pink"
                                className="sr-only peer/pink"
                            />
                            <label
                                htmlFor="color-pink"
                                className="w-6 h-6 rounded-full bg-pink-300 border-2 border-gray-200 cursor-pointer hover:border-gray-600 transition-colors peer-checked/pink:border-gray-600"
                            ></label>
                        </div>
                    </div>
                    <div className='flex justify-start gap-1 mt-1'>
                        <input type='checkbox' id='option' name='option' defaultChecked
                               className='border-1 border-gray-300'/>
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