import { get } from 'lodash'
import React from 'react'

import Repeatable from './repeatable'
import { StoreContext } from '../providers/store_provider'

interface RepeatableWrapperProps {
    path: string
    children: React.ReactNode
}

const RepeatableWrapper: React.FC<RepeatableWrapperProps> = ({
    path,
    children,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return (
                    <Repeatable
                        path={path}
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
