import React, { useState, useCallback } from 'react'
import { Card } from 'react-bootstrap'

interface CollapsibleTextProps {
    text: string
    title: string
    content?: React.ReactNode
}

const CollapsibleText = (props: CollapsibleTextProps) => {
    const { text, title, content } = props
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(val => !val)
    }, [])

    return (
        <Card className="collapsible-text-card mb-3">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <div
                    className={`collapsible-text ${
                        isCollapsed ? 'collapsed' : ''
                    }`}
                >
                    <p className="description">
                        {text}
                        <span
                            className={`clickable-text ${
                                isCollapsed ? 'collapsed' : ''
                            }`}
                            onClick={toggleCollapse}
                        >
                            {isCollapsed ? '...see more' : '...show less'}
                        </span>
                    </p>
                </div>
                <div className="content">{content}</div>
            </Card.Body>
        </Card>
    )
}

export default CollapsibleText
