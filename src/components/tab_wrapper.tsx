import React from 'react'
import { Tab } from 'react-bootstrap'

interface TabWrapperProps {
    children: React.ReactNode
    eventKey: string
    printPdf: boolean
    title: React.ReactNode
}

const TabWrapper: React.FC<TabWrapperProps> = ({
    children,
    eventKey,
    printPdf,
    title,
}) => {
    return (
        <Tab style={{ paddingTop: '1rem' }} eventKey={eventKey} title={title}>
            {children}
        </Tab>
    )
}

export default TabWrapper
