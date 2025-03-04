import { get } from 'lodash'
import React from 'react'

import StringInput from './string_input'
import { StoreContext } from '../providers/store_provider'

interface StringInputWrapperProps {
    label: string
    path: string
    min: number
    max: number
    regexp: RegExp
    hint: string
}

const StringInputWrapper: React.FC<StringInputWrapperProps> = ({
    label,
    path,
    min = 0,
    max = 1024,
    regexp = /.*/,
    hint,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc, upsertData }) => {
                return (
                    <StringInput
                        label={label}
                        value={doc && get(doc.data_, path)}
                        min={min}
                        max={max}
                        regexp={regexp}
                        hint={hint}
                        onChange={async value => await upsertData(path, value)}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default StringInputWrapper
