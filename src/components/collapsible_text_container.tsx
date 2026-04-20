import React, { useCallback, useState } from 'react'
import { Card } from 'react-bootstrap'
import CollapsibleText from './collapsible_text'

interface CollapsibleTextContainerProps {
    children?: React.ReactNode
    text: React.ReactNode
    title: React.ReactNode
    showChildrenOnExpand?: boolean
}

const CollapsibleTextContainer: React.FC<CollapsibleTextContainerProps> = ({
    children,
    text,
    title,
    showChildrenOnExpand = false,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prevState => !prevState)
    }, [])

    const shouldShowChildren = !showChildrenOnExpand || !isCollapsed

    return (
        <Card className="collapsible-text-container">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <CollapsibleText
                    text={text}
                    title={title}
                    isCollapsed={isCollapsed}
                    onToggle={toggleCollapse}
                />
                {shouldShowChildren && children && <div className="content">{children}</div>}
            </Card.Body>
        </Card>
    )
}

export default CollapsibleTextContainer
