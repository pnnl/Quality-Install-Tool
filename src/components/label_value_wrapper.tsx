import { get } from 'lodash'
import React from 'react'

import LabelValue from './label_value'
import { StoreContext } from '../providers/store_provider'

interface LabelValueWrapperProps {
    label: string
    path: string
    prefix?: string
    suffix?: string
    required?: boolean
    parent?: any
}

const LabelValueWrapper: React.FC<LabelValueWrapperProps> = ({
    label,
    path,
    prefix,
    suffix,
    parent = null,
    required = false,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                const value = get(
                    parent ? parent.data_ : doc ? doc.data_ : undefined,
                    path,
                )

                return (
                    <LabelValue
                        label={label}
                        value={value}
                        required={required}
                        prefix={prefix}
                        suffix={suffix}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default LabelValueWrapper
