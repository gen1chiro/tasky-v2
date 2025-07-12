import { Timestamp } from 'firebase/firestore';

export type Board = {
    id: string
    name: string
    owner: string
    createdAt: Timestamp
}

export type Task = {
    columnId: string
    createdAt: Timestamp
    name: string
    position: number
}

export type Column = {
    id: string
    name: string
    position: number
    createdAt: Timestamp
}