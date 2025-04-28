import React from 'react'

import CollapsibleText from './collapsible_text'
import { StoreContext } from '../providers/store_provider'

interface CollapsibleTextWrapperProps {
    text: string
    title: string
}

const CollapsibleTextWrapper: React.FC<CollapsibleTextWrapperProps> = ({
    text,
    title,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return <CollapsibleText text={text} title={title} />
            }}
        </StoreContext.Consumer>
    )
}

export default CollapsibleTextWrapper
