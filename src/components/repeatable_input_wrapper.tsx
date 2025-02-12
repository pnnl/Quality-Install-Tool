import React from 'react'

import RepeatableInput from './repeatable_input'
import { StoreContext } from '../providers/store_provider'

interface RepeatableInputWrapperProps {
    label: string
    path: string
    children: any
    parent?: any
    max?: number
    count?: number
    fixed?: boolean
}

const RepeatableInputWrapper: React.FC<RepeatableInputWrapperProps> = ({
    label,
    path,
    children,
    parent,
    max = 5,
    count = 1,
    fixed = false,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return (
                    <RepeatableInput
                        path={path}
                        label={label}
                        data={
                            parent ? parent.data_ : doc ? doc.data_ : undefined
                        }
                        docId={parent ? parent?._id : doc ? doc._id : undefined}
                        max={max}
                        count={count}
                        fixed={fixed}
                    >
                        {children}
                    </RepeatableInput>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default RepeatableInputWrapper
