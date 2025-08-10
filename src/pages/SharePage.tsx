import {useNavigate, useSearchParams} from "react-router-dom"
import {useEffect} from "react"
import {addBoardMember} from "../firebase/firestore/boards.ts"
import {useAuth} from "../contexts/AuthContext.tsx";

const SharePage = () => {
    const [searchParams] = useSearchParams()
    const boardId = searchParams.get('boardId')
    const navigate = useNavigate()
    const {user} = useAuth()
    const {uid: userId} = user

    useEffect( () => {
        const addMemberAndRedirect = async () => {
            await addBoardMember(boardId, userId)
            navigate(`/app/${boardId}`, {replace: true})
        }

        addMemberAndRedirect()
    }, [navigate, boardId, userId])

    return null
}

export default SharePage