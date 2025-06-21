import { Timestamp } from 'firebase/firestore';

export type Board = {
    id: string
    name: string
    owner: string
    createdAt: Timestamp
}