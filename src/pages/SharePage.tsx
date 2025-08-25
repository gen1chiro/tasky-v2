import {useNavigate, useSearchParams} from "react-router-dom"
import {useEffect} from "react"
import {addBoardMember} from "../firebase/firestore/boards.ts"
import {useAuth} from "../contexts/AuthContext.tsx";

const SharePage = () => {
    const [searchParams] = useSearchParams()
    const boardId = searchParams.get('boardId') || ''
    const navigate = useNavigate()
    const {user} = useAuth()

    useEffect( () => {
        const addMemberAndRedirect = async () => {
            if (user?.uid) {
                await addBoardMember(boardId, user.uid)
                navigate(`/app/${boardId}`, {replace: true})
            }

        }
        addMemberAndRedirect()
    }, [navigate, boardId, user])

    return null
}

export default SharePage