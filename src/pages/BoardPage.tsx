import { useLoaderData } from "react-router-dom"

const BoardPage = () => {
    const columns = useLoaderData()

    console.log(columns)

    const columnElements = columns.map((column) => {
        return (
            <div key={column.id}>
                <h2>{column.name}</h2>
                {/* Render tasks or other details here */}
            </div>
        )
    })

    return (
        <div>
            <h1>Board</h1>
            <div className='flex gap-4'>
                {columnElements}
            </div>
        </div>
    )
}

export default BoardPage