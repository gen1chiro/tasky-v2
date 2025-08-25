import { Timestamp } from 'firebase/firestore';

export type Board = {
    id: string
    name: string
    owner: string
    color: string
    members: string[]
    createdAt: Timestamp
}

export type Task = {
    id: string
    columnId: string
    createdAt: Timestamp
    name: string
    description: string
    priority: string
    dueDate: string
    position: number
}

export type Column = {
    id: string
    name: string
    position: number
    tasks: Task[]
    createdAt: Timestamp
}

export type Plan = {
    id: number
    name: string
    price: string
    desc: string
    features: string[]
}

export type Faq = {
    question: string
    answer: string
}