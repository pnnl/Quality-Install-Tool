import React from 'react'
import { Accordion } from 'react-bootstrap'

interface CollapsibleProps {
    header: React.ReactNode
    children: React.ReactNode
    defaultOpen?: boolean
    id?: string
}

const Collapsible: React.FC<CollapsibleProps> = ({
    header,
    children,
    defaultOpen = false,
    id,
}) => {
    return (
        <Accordion defaultActiveKey={defaultOpen ? '0' : undefined} id={id}>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{header}</Accordion.Header>
                <Accordion.Body>{children}</Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default Collapsible
