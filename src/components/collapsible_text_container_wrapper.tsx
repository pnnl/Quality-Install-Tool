import React from 'react'

import CollapsibleTextContainer from './collapsible_text_container'
import { StoreContext } from '../providers/store_provider'

interface CollapsibleTextContainerWrapperProps {
    children?: React.ReactNode
    text: React.ReactNode
    title: React.ReactNode
}

const CollapsibleTextContainerWrapper: React.FC<
    CollapsibleTextContainerWrapperProps
> = ({ children, text, title }) => {
    return (
        <StoreContext.Consumer>
            {() => {
                return (
                    <CollapsibleTextContainer text={text} title={title}>
                        {children}
                    </CollapsibleTextContainer>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default CollapsibleTextContainerWrapper
