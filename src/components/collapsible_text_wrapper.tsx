import React from 'react'

import CollapsibleText from './collapsible_text'
import { StoreContext } from '../providers/store_provider'

interface CollapsibleTextWrapperProps {
    text: string
    maxLength: number
}

const CollapsibleTextWrapper: React.FC<CollapsibleTextWrapperProps> = ({
    text,
    maxLength,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return <CollapsibleText text={text} maxLength={maxLength} />
            }}
        </StoreContext.Consumer>
    )
}

export default CollapsibleTextWrapper
