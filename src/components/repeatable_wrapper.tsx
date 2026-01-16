import { get } from 'lodash'
import React from 'react'

import Repeatable from './repeatable'
import { StoreContext } from '../providers/store_provider'

interface RepeatableWrapperProps {
    path: string
    children: React.ReactNode
    label?: string
}

const RepeatableWrapper: React.FC<RepeatableWrapperProps> = ({
    path,
    children,
    label,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return (
                    <Repeatable
                        path={path}
                        label={label}
                        keys={Object.keys((doc && get(doc.data_, path)) ?? [])}
                    >
                        {children}
                    </Repeatable>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default RepeatableWrapper
