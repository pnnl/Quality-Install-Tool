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
 * A wrapper component for the DocNameInput component, integrating it with
 * a context that provides metadata and an updater function.
 *
 * This component retrieves the current value of the input from the context
 * and updates it when the value changes. It also generates a unique ID for
 * the input field based on the provided path.
 *
 * @param label - The label text for the input field.
 * @param path - The path to access and update the metadata in the context.
 * @param regexp - Optional regular expression for input validation (defaults to a specific pattern).
 * @param hint - Optional hint text to display below the input field.
 * @returns The rendered component.
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
            {({ metadata, upsertMetadata }) => {
                return (
                    <DocNameInput
                        id={id}
                        label={label}
                        updateValue={(value: any) =>
                            upsertMetadata(path, value)
                        }
                        value={get(metadata, path)}
                        regexp={regexp}
                        hint={hint}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default DocNameInputWrapper
