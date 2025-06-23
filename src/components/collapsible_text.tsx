import React, { useCallback, useState } from 'react'
import { Card } from 'react-bootstrap'

interface CollapsibleTextProps {
    children?: React.ReactNode
    text: React.ReactNode
    title: React.ReactNode
}

const CollapsibleText: React.FC<CollapsibleTextProps> = ({
    children,
    text,
    title,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prevState => !prevState)
    }, [])

    const isExpandable = typeof text === 'string' && text.length > 75

    return (
        <Card className="collapsible-text-card mb-3">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <div
                    className={`collapsible-text ${isCollapsed && isExpandable ? 'collapsed' : ''}`}
                >
                    <p className="description">
                        {text}
                        {isExpandable && (
                            <span
                                className={`clickable-text ${isCollapsed ? 'collapsed' : ''}`}
                                onClick={toggleCollapse}
                            >
                                {isCollapsed ? '...see more' : '...show less'}
                            </span>
                        )}
                    </p>
                </div>
                {children && <div className="content">{children}</div>}
            </Card.Body>
        </Card>
    )
}

export default CollapsibleText
