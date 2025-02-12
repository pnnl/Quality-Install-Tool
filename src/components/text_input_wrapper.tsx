import { get } from 'lodash'
import React, { FC } from 'react'

import { StoreContext } from './store'
import TextInput from './text_input'
import { pathToId } from '../utilities/paths_utils'

interface TextInputWrapperProps {
    label: string
    path: string
    min: number
    max: number
    regexp: RegExp
}

/**
 * A component that wraps a TextInput component in order to tie it to the data store
 *
 * @param label The label of the TextInput component
 * @param path The path (consistent with the path provided to the lodash
 * get() method) to the datum within the data store for the TextInput component
 * @param min The minimum allowed value for the input field, defult to 0.
 * @param max The maximum allowed value for the input field, defult to 10240.
 * @param regexp The regular expression pattern to validate the input string, defult to take anything.
 */
const TextInputWrapper: FC<TextInputWrapperProps> = ({
    label,
    path,
    min = 0,
    max = 10240,
    regexp = /.*/,
}) => {
    // Generate an id for the input
    const id = pathToId(path, 'input')

    return (
        <StoreContext.Consumer>
            {({ data, upsertData }) => {
                return (
                    <TextInput
                        id={id}
                        label={label}
                        updateValue={(value: any) => {
                            debugger
                            upsertData(path, value)
                        }}
                        value={get(data, path)}
                        min={min}
                        max={max}
                        regexp={regexp}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default TextInputWrapper
