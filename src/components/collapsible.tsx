import React from 'react'
import { Accordion } from 'react-bootstrap'

interface CollapsibleProps {
    header: React.ReactNode
    children: React.ReactNode
}

const Collapsible: React.FC<CollapsibleProps> = ({ header, children }) => {
    return (
        <Accordion className="bottom-margin">
            <Accordion.Item eventKey="0">
                <Accordion.Header>{header}</Accordion.Header>
                <Accordion.Body>{children}</Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default Collapsible
