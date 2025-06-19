import { useAuth } from "../contexts/AuthContext.tsx"
import { handleSignOut } from "../firebase/auth.ts"

const MainApplication = () => {
    const { user } = useAuth()

    return (
        <div className='flex flex-col items-center gap-10 max-w-xl bg-slate-500 mx-auto text-white'>
            <h1>Welcome {user?.email}</h1>
            <button onClick={handleSignOut}>Log Out</button>
        </div>
    )
}

export default MainApplication