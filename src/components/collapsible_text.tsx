import React, { useState } from 'react'

interface CollapsibleTextProps {
    text: string
    maxLength: number
}

const CollapsibleText = (props: CollapsibleTextProps) => {
    const { text, maxLength } = props
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed)
    }

    if (text.length <= maxLength) {
        return <p>{text}</p>
    }

    return (
        <div>
            <p>{isCollapsed ? `${text.substring(0, maxLength)}...` : text}</p>
            <button onClick={toggleCollapse}>
                {isCollapsed ? 'Show more' : 'Show less'}
            </button>
        </div>
    )
}

export default CollapsibleText
