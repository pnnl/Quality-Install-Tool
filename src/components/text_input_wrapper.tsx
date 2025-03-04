import { get } from 'lodash'
import React from 'react'

import TextInput from './text_input'
import { StoreContext } from '../providers/store_provider'

interface TextInputWrapperProps {
    label: string
    path: string
    min: number
    max: number
    regexp: RegExp
    placeholder?: string
}

const TextInputWrapper: React.FC<TextInputWrapperProps> = ({
    label,
    path,
    min = 0,
    max = 10240,
    regexp = /.*/,
    placeholder,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc, upsertData }) => {
                return (
                    <TextInput
                        label={label}
                        value={doc && get(doc.data_, path)}
                        min={min}
                        max={max}
                        regexp={regexp}
                        placeholder={placeholder}
                        onChange={async value => await upsertData(path, value)}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default TextInputWrapper
