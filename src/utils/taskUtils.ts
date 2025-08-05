export const formatDate = (date: string): string => {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]

    const [year, month, day] = date.split("-")
    const monthStr = months[parseInt(month, 10) - 1]

    return `${day} ${monthStr} ${year}`
}

export const formatPriority = (priority: string): string => {
    switch (priority.toLowerCase()) {
        case "low":
            return "bg-green-100 text-green-800"
        case "medium":
            return "bg-yellow-100 text-yellow-800"
        case "high":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}