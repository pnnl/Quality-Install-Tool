import { get } from 'lodash'
import React, { FC } from 'react'

import { StoreContext } from './store'
import { pathToId } from '../utilities/path_utils'
import Radio from './radio'

interface RadioWrapperProps {
    label: string
    options: string[]
    path: string
}

/**
 * A component that wraps a Radio component in order to tie it to the data store
 *
 * @param label The label of the Radio component
 * @param options An array of strings representing the options for the Radio
 * component
 * @param path The path (consistent with the path provided to the lodash
 * get() method) to the datum within the data store for the Radio component
 */
const RadioWrapper: FC<RadioWrapperProps> = ({ label, options, path }) => {
    // Generate an id for the input
    const id = pathToId(path, 'input')
    return (
        <StoreContext.Consumer>
            {({ data, upsertData }) => {
                return (
                    <Radio
                        id={id}
                        label={label}
                        options={options}
                        updateValue={(value: any) => upsertData(path, value)}
                        value={get(data, path)}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default RadioWrapper
