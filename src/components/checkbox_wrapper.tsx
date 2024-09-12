import { get } from 'lodash'
import React, { FC } from 'react'

import { StoreContext } from './store'
import { pathToId } from '../utilities/paths_utils'
import Checkbox from './checkbox'

interface CheckBoxWrapperProps {
    label: string
    options: string[]
    path: string
    default_value?: string[]
}

/**
 * A component that wraps a Radio component in order to tie it to the data store
 *
 * @param label The label of the Radio component
 * @param options An array of strings representing the options for the CheckBox
 * component
 * @param path The path (consistent with the path provided to the lodash
 * @param default_value An array of strings representing the options that are checked by default
 * get() method) to the datum within the data store for the Radio component
 */
const CheckBoxWrapper: FC<CheckBoxWrapperProps> = ({
    label,
    options,
    path,
    default_value,
}) => {
    // Generate an id for the input
    const id = pathToId(path, 'input')
    return (
        <StoreContext.Consumer>
            {({ data, upsertData }) => {
                return (
                    <Checkbox
                        id={id}
                        label={label}
                        options={options}
                        updateValue={(value: any) => upsertData(path, value)}
                        value={
                            get(data, path) ? get(data, path) : default_value
                        }
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default CheckBoxWrapper
