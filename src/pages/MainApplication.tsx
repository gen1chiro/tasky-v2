import { useAuth } from "../contexts/AuthContext.tsx"
import { handleSignOut } from "../firebase/auth.ts"

const MainApplication = () => {
    const { user } = useAuth()

    const handleAddBoard = () => {

    }

    return (
        <div className='flex flex-col items-center gap-10 max-w-xl bg-slate-500 mx-auto text-white'>
            <h1>Welcome {user?.email}</h1>
            <div className='w-full flex justify-start px-4'>
                <button onClick={handleAddBoard} className='bg-white rounded-lg aspect-square w-28 text-black'>
                    Add Board
                </button>
            </div>
            <button onClick={handleSignOut}>Log Out</button>
        </div>
    )
}

export default MainApplication