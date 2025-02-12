import React from 'react'

import Repeatable from './repeatable'
import { StoreContext } from '../providers/store_provider'

interface RepeatableWrapperProps {
    label: string
    path: string
    children: any
    parent?: any
}

const RepeatableWrapper: React.FC<RepeatableWrapperProps> = ({
    label,
    path,
    children,
    parent,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return (
                    <Repeatable
                        path={path}
                        label={label}
                        data={
                            parent ? parent.data_ : doc ? doc.data_ : undefined
                        }
                    >
                        {children}
                    </Repeatable>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default RepeatableWrapper
