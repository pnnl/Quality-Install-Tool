import React, { useCallback, useState } from 'react'

import CollapsibleText from './collapsible_text'
import { StoreContext } from '../providers/store_provider'

interface CollapsibleTextWrapperProps {
    children?: React.ReactNode
    text: React.ReactNode
    title: React.ReactNode
}

const CollapsibleTextWrapper: React.FC<CollapsibleTextWrapperProps> = ({
    children,
    text,
    title,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prevState => !prevState)
    }, [])

    return (
        <StoreContext.Consumer>
            {() => {
                return (
                    <CollapsibleText
                        text={text}
                        title={title}
                        isCollapsed={isCollapsed}
                        onToggle={toggleCollapse}
                    >
                        {children}
                    </CollapsibleText>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default CollapsibleTextWrapper
