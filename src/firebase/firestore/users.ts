import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.ts'

export const saveUserToDatabase = async (userUID: string, userEmail: string) => {
    const userDoc = doc(db, 'users', userUID)
    const snap = await getDoc(userDoc)

    if (!snap.exists()) {
        try {
            await setDoc(userDoc, {
                email: userEmail,
                createdAt: serverTimestamp(),
            })
        } catch (err) {
            console.error('Error saving user to database:', err)
            throw new Error('Failed to save user data')
        }
    }
}
