import React from 'react'
import { Card } from 'react-bootstrap'
import CollapsibleText from './collapsible_text'

interface CollapsibleTextContainerProps {
    children?: React.ReactNode
    text: React.ReactNode
    title: React.ReactNode
}

const CollapsibleTextContainer: React.FC<CollapsibleTextContainerProps> = ({
    children,
    text,
    title,
}) => {
    return (
        <Card className="collapsible-text-container">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <CollapsibleText text={text} title={title} />
                {children && <div className="content">{children}</div>}
            </Card.Body>
        </Card>
    )
}

export default CollapsibleTextContainer
