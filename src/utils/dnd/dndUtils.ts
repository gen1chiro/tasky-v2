import type {Dispatch, MutableRefObject, SetStateAction} from "react"
import type {DragEndEvent, DragStartEvent} from "@dnd-kit/core"
import {arrayMove} from "@dnd-kit/sortable"
import {addTaskAtPosition, deleteTask, editTask} from "../../firebase/firestore/tasks.ts"
import {editColumn} from "../../firebase/firestore/columns.ts"
import type {Column, Task} from "../../types/types.ts"

const findColumn = (id: string, columns: Column[]) => {
    const container = columns.find(column => column.id === id)
    if (container) return container

    return columns.find((column) =>
        column.tasks.some((item) => item.id === id)
    )
}

const isColumn = (id: string, columns: Column[]) => {
    return columns.some(column => column.id === id)
}

export const handleDragStart = (
    event: DragStartEvent, columns: Column[],
    setActiveColumn: Dispatch<SetStateAction<Column | null>>,
    lastColumnId: MutableRefObject<string | null>,
    setActiveTask: Dispatch<SetStateAction<Task | null>>
) => {
    const {active} = event
    const {id} = active

    if (isColumn(id as string, columns)) {
        const column = findColumn(id as string, columns)
        setActiveColumn(column || null)
    } else {
        lastColumnId.current = active.data.current?.columnId as string
        const column = findColumn(lastColumnId.current, columns)
        const task = column?.tasks.find(task => task.id === id)
        setActiveTask(task || null)
    }
}

export const handleDragEnd = async (
    event: DragEndEvent,
    columns: Column[],
    setColumns: Dispatch<SetStateAction<Column[]>>,
    lastColumnId:  MutableRefObject<string | null>,
    boardId: string,
    setActiveTask: Dispatch<SetStateAction<Task | null>>,
    setActiveColumn: Dispatch<SetStateAction<Column | null>>
) => {
    //In column task DND
    const {active, over} = event
    const {id} = active
    const overId = over ? over.id : null

    const activeContainer = findColumn(id as string, columns)
    const overContainer = findColumn(overId as string, columns)
    //const previousContainer = findColumn(lastColumnId.current)

    if (!activeContainer || !overContainer || isColumn(id as string, columns)) {
        return
    }

    const activeIndex = activeContainer.tasks.findIndex((task) => task.id === id)
    const overIndex = overContainer.tasks.findIndex((task) => task.id === overId)

    const newColumnTasks = columns.map(column =>
        column.id === activeContainer.id
            ? {
                ...column,
                tasks: arrayMove(column.tasks, activeIndex, overIndex)
            }
            : column
    )

    setColumns(newColumnTasks)

    const isSameContainer = lastColumnId.current === overContainer.id

    if (isSameContainer) {
        if (activeIndex === overIndex) return

        await Promise.all(
            newColumnTasks.map(columnTask =>
                columnTask.tasks.map((task, index) =>
                    task.columnId === activeContainer.id
                        ? editTask(boardId as string, activeContainer.id, task.id, index, "position")
                        : null
                )
            )
        )
    } else {
        const movedItem = overContainer.tasks.find(task => task.id === id) as Task

        await deleteTask(boardId as string, lastColumnId.current as string, movedItem.id)
        await Promise.all(
            newColumnTasks.map(columnTask =>
                columnTask.tasks.map((task, index) =>
                    task.columnId === activeContainer.id && task.id !== movedItem.id
                        ? editTask(boardId as string, activeContainer.id, task.id, index, "position")
                        : null
                )
            )
        )
        await addTaskAtPosition(boardId as string, overContainer.id, movedItem, overIndex)
    }

    setActiveTask(null)
    setActiveColumn(null)
}

export const handleDragOver = async (
    event: DragEndEvent,
    columns: Column[],
    setColumns: Dispatch<SetStateAction<Column[]>>,
    boardId: string
) => {
    const {active, over} = event
    const {id} = active
    const overId = over ? over.id : null

    // Handle container reordering
    if (isColumn(id as string, columns)) {
        if (!over) return

        let targetContainerId = overId

        // If hovering over an item, find its parent container
        if (!isColumn(overId as string, columns)) {
            const overContainer = findColumn(overId as string, columns)
            if (!overContainer) return
            targetContainerId = overContainer.id
        }

        const activeIndex = columns.findIndex(container => container.id === id)
        const overIndex = columns.findIndex(container => container.id === targetContainerId)

        const newColumns = arrayMove(columns, activeIndex, overIndex)
        setColumns(newColumns)

        await Promise.all(
            newColumns.map((column, index) =>
                editColumn(boardId, column.id, index, "position")
            )
        )

        return
    }
    // Cross column task DND
    const activeContainer = findColumn(id as string, columns)
    const overContainer = findColumn(overId as string, columns)

    if (!activeContainer || !overContainer || activeContainer.id === overContainer.id) {
        return
    }

    const activeItems = activeContainer.tasks
    const overItems = overContainer.tasks

    const activeIndex = activeItems.findIndex((task) => task.id === id)
    const overIndex = overItems.findIndex((task) => task.id === overId)

    const activeTop = active.rect.current.translated?.top ?? active.rect.current.initial?.top ?? 0;

    let newIndex
    if (overId) {
        const isBelowLastItem =
            over &&
            overIndex === overItems.length - 1 &&
            activeTop > over.rect.top + over.rect.height

        const modifier = isBelowLastItem ? 1 : 0

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
    } else {
        newIndex = overItems.length + 1
    }

    const movedItem = {
        ...activeItems[activeIndex],
        columnId: overContainer.id
    }

    const newColumns = columns.map((container) => {
        if (container.id === activeContainer.id) {
            return {
                ...container,
                tasks: activeItems.filter(item => item.id !== id)
            }
        }
        if (container.id === overContainer.id) {
            return {
                ...container,
                tasks: [
                    ...overItems.slice(0, newIndex),
                    movedItem,
                    ...overItems.slice(newIndex)
                ]
            }
        }
        return container
    })

    setColumns(newColumns)
}