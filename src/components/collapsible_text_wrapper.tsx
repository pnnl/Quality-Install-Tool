import React from 'react'

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
    return (
        <StoreContext.Consumer>
            {() => {
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
