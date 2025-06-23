import { auth } from "../firebase/firebase.ts"

const requireAuth = async () => {
    return new Promise((resolve) => {
        if (auth.currentUser) {
            resolve(auth.currentUser)
            return
        }

        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe()
            resolve(user)
        })
    })
}

export default requireAuth