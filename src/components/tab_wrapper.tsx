import React from 'react'
import { Tab } from 'react-bootstrap'

interface TabWrapperProps {
    children: React.ReactNode
    eventKey: string
    title: React.ReactNode
}

const TabWrapper: React.FC<TabWrapperProps> = ({
    children,
    eventKey,
    title,
}) => {
    return (
        <Tab style={{ paddingTop: '1rem' }} eventKey={eventKey} title={title}>
            {children}
        </Tab>
    )
}

export default TabWrapper
