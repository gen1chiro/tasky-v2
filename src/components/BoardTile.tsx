import {useNavigate} from "react-router-dom"
import {MdDelete} from "react-icons/md"
import {FaChevronRight} from "react-icons/fa"

const BoardTile = ({board, showModal}) => {
    const {id, name, color} = board
    const navigate = useNavigate()

    return (
        <div className='w-full flex flex-col text-gray-600 bg-white rounded-lg aspect-square border border-gray-300 hover:shadow overflow-hidden'>
            <div className={`w-full flex flex-grow justify-between items-start bg-${color}-300 p-4`}>
                <button onClick={() => showModal(id)}
                        className='bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200 text-sm'>
                    <MdDelete/>
                </button>
                <button onClick={() => navigate(id)}
                        className='bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200 text-sm'>
                    <FaChevronRight/>
                </button>
            </div>
            <div className='flex justify-between items-center p-4'>
                <h2 className='text-black font-medium truncate'>{name}</h2>
            </div>
        </div>
    )
}

export default BoardTile