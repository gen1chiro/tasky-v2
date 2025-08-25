import {useState, useRef} from "react"
import {useNavigate} from "react-router-dom"
import {renameBoard} from "../../firebase/firestore/boards.ts"
import Modal from "./modal/Modal.tsx"
import ModalHeader from "./modal/ModalHeader.tsx"
import ModalMessage from "./modal/ModalMessage.tsx"
import {MdLink} from "react-icons/md"
import tasky from '../../assets/tasky.png'

interface BoardHeaderProps {
    boardName: string
    boardId: string
}

const BoardHeader = ({boardName, boardId}: BoardHeaderProps) => {
    const [name, setName] = useState<string>(boardName)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const shareModalRef = useRef<HTMLDialogElement | null>(null)
    const navigate = useNavigate()
    const link = window.location.origin + '/app/share/?boardId=' + boardId

    const showShareModal = () => {
        shareModalRef.current?.showModal()
    }

    const hideShareModal = () => {
        shareModalRef.current?.close()
    }

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(link)
    }

    return (
        <>
            <header className='flex justify-between py-4 px-8 border border-gray-200'>
                <div className='flex items-center gap-4'>
                    <button
                        onClick={() => navigate('/app')}
                        className='flex items-center justify-center w-6 h-6 bg-blue-500 rounded'
                    >
                        <img src={tasky as string} alt='tasky logo' className='w-11/12 aspect-square'/>
                    </button>
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
                </div>
                <button
                    onClick={showShareModal}
                    className='bg-blue-600 px-3 py-1 rounded text-white text-sm hover:bg-blue-500'
                >
                    Share
                </button>
            </header>

            <Modal ref={shareModalRef} onClose={hideShareModal}>
                <ModalHeader>Share {boardName}</ModalHeader>
                <ModalMessage>Copy the link below to share this board.</ModalMessage>
                <div onClick={copyToClipboard} className='flex items-center justify-between gap-2 text-gray-600 border border-gray-300 rounded p-2 mt-2 hover:bg-gray-100 hover:text-black transition-colors duration-200'>
                    <p className='text-xs truncate'>{link}</p>
                    <MdLink />
                </div>
            </Modal>
        </>
    )
}

export default BoardHeader