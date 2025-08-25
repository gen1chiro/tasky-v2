import {useLoaderData, useParams, Await} from "react-router-dom"
import {type ReactNode, Suspense} from "react"
import Board from "../components/app/Board.tsx"
import BoardHeader from "../components/app/BoardHeader.tsx"

const BoardPage = () => {
    const { boardInfo, initialBoardData } = useLoaderData()
    const { boardId } = useParams<{ boardId: string }>()
    const id = boardId!
    const boardName = boardInfo?.name || "Untitled Board"

    return (
        <main className='w-full h-screen flex flex-col'>
            <BoardHeader boardName={boardName} boardId={id}/>
            <Suspense fallback={<BoardSkeleton /> as ReactNode}>
                <Await resolve={initialBoardData}>
                    {(initialData) => (
                        <Board
                            initialBoardData={initialData}
                            boardId={id}
                        /> as ReactNode
                    )}
                </Await>
            </Suspense>
        </main>
    )
}

export default BoardPage

const BoardSkeleton = () => (
    <div className='w-full flex-grow flex gap-4 items-start overflow-auto p-4'>
        {[1, 2, 3].map(i => (
            <div key={i} className='min-w-sm h-[292px] bg-slate-100 p-3 rounded-xl animate-pulse'>
                <div className='h-6 bg-white rounded mb-4'></div>
                <div className='space-y-3'>
                    <div className='h-20 bg-white rounded'></div>
                    <div className='h-16 bg-white rounded'></div>
                </div>
            </div>
        ))}
    </div>
)