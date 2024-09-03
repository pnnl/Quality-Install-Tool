import { get } from 'lodash'
import React, { FC } from 'react'

import { StoreContext } from './store'
import DocNameInput from './doc_name_input'
import { pathToId } from '../utilities/paths_utils'

interface StringInputWrapperProps {
    label: string
    path: string
    regexp: RegExp
    hint: string
}

/**
 * A component that wraps a StringInput component in order to tie it to the data store
 *
 * @param label The label of the StringInput component
 * @param path The path (consistent with the path provided to the lodash
 * get() method) to the datum within the data store for the StringInput component
 * @param regexp The regular expression pattern to validate the input string, defult to take anything.
 * @param hint Displays hint text for the StringInput component.
 */
const DocNameInputWrapper: FC<StringInputWrapperProps> = ({
    label,
    path,
    regexp = /^(?![\s-])[a-zA-Z0-9, \-]{1,64}$/,
    hint,
}) => {
    // Generate an id for the input
    const id = pathToId(path, 'input')

    return (
        <StoreContext.Consumer>
            {({ data, upsertData }) => {
                return (
                    <DocNameInput
                        id={id}
                        label={label}
                        updateValue={(value: any) => upsertData(path, value)}
                        value={get(data, path)}
                        regexp={regexp}
                        hint={hint}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default DocNameInputWrapper
