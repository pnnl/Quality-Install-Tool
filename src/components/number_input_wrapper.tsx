import { get } from 'lodash'
import React from 'react'

import NumberInput from './number_input'
import { StoreContext } from '../providers/store_provider'

interface NumberInputWrapperProps {
    label: React.ReactNode
    path: string
    prefix: React.ReactNode
    suffix: React.ReactNode
    min?: number
    max?: number
    step?: number
    hint: React.ReactNode
}

const NumberInputWrapper: React.FC<NumberInputWrapperProps> = ({
    label,
    path,
    prefix,
    suffix,
    min,
    max,
    step,
    hint,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc, upsertData }) => {
                return (
                    <NumberInput
                        label={label}
                        prefix={prefix}
                        suffix={suffix}
                        value={doc && get(doc.data_, path)}
                        min={min}
                        max={max}
                        step={step}
                        hint={hint}
                        onChange={async value => upsertData(path, value)}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default NumberInputWrapper
