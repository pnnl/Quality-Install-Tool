import React, { useState, useCallback } from 'react'
import { Card } from 'react-bootstrap'

interface CollapsibleTextProps {
    text: React.ReactNode
    title: React.ReactNode
    children?: React.ReactNode
}

const CollapsibleText: React.FC<CollapsibleTextProps> = ({
    text,
    title,
    children,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prevState => !prevState)
    }, [])

    return (
        <Card className="collapsible-text-card mb-3">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <div
                    className={`collapsible-text ${isCollapsed ? 'collapsed' : ''}`}
                >
                    <p className="description">
                        {text}
                        <span
                            className={`clickable-text ${isCollapsed ? 'collapsed' : ''}`}
                            onClick={toggleCollapse}
                        >
                            {isCollapsed ? '...see more' : '...show less'}
                        </span>
                    </p>
                </div>
                {children && <div className="content">{children}</div>}
            </Card.Body>
        </Card>
    )
}

export default CollapsibleText
