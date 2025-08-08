import {useNavigate} from "react-router-dom"
import {MdDelete} from "react-icons/md"
import {FaChevronRight} from "react-icons/fa"

const BoardTile = ({board, showModal}) => {
    const navigate = useNavigate()

    return (
        <div key={board.id}
             className='w-full flex flex-col text-gray-600 bg-white rounded-lg aspect-square shadow border border-gray-200 group overflow-hidden'>
            <div className={`w-full flex flex-grow justify-between items-start bg-${board.color}-300 p-4`}>
                <button id={board.id} onClick={() => showModal(board.id)}
                        className='hidden group-hover:block bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200 text-xl'>
                    <MdDelete/>
                </button>
                <button onClick={() => navigate(board.id)}
                        className='hidden group-hover:block bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200'>
                    <FaChevronRight/>
                </button>
            </div>
            <div className='flex justify-between items-center p-4'>
                <h2 className='text-lg font-semibold truncate'>{board.name}</h2>
            </div>
        </div>
    )
}

export default BoardTile