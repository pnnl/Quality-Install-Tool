import React from 'react'

import CollapsibleText from './collapsible_text'
import { StoreContext } from '../providers/store_provider'

interface CollapsibleTextWrapperProps {
    text: string
    title: string
    content?: React.ReactNode
}

const CollapsibleTextWrapper: React.FC<CollapsibleTextWrapperProps> = ({
    text,
    title,
    content,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return (
                    <CollapsibleText
                        text={text}
                        title={title}
                        content={content}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default CollapsibleTextWrapper
