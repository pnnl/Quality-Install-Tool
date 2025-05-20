import React from 'react'

import CollapsibleText from './collapsible_text'
import { StoreContext } from '../providers/store_provider'

interface CollapsibleTextWrapperProps {
    text: React.ReactNode
    title: React.ReactNode
    children?: React.ReactNode
}

const CollapsibleTextWrapper: React.FC<CollapsibleTextWrapperProps> = ({
    text,
    title,
    children,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return (
                    <CollapsibleText text={text} title={title}>
                        {children}
                    </CollapsibleText>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default CollapsibleTextWrapper
