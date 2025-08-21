import {Link} from 'react-router-dom'

const CtaBanner = () => {
    return (
        <div className='flex items-center justify-center text-center w-11/12 max-w-7xl mx-auto rounded-3xl h-96 my-14 p-4 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-600 '>
            <div className='w-5/6 flex flex-col items-center gap-4'>
                <h1 className='text-3xl md:text-4xl font-semibold'>Boost your productivity today</h1>
                <p className='text-xs md:text-sm '>Start organizing tasks and collaborating with your team in real-time — for free.</p>
                <Link to='/sign-up'
                      className='bg-black hover:bg-zinc-800 text-gray-300 text-sm px-3 py-1 rounded-md transition-colors duration-200'>
                    Get Started
                </Link>
            </div>
        </div>
    )
}

export default CtaBanner