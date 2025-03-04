import { get } from 'lodash'
import React from 'react'

import Select from './select'
import { StoreContext } from '../providers/store_provider'

interface SelectWrapperProps {
    label: React.ReactNode
    options: string[] | [string, string][]
    path: string
}

/**
 * A component that wraps a Select component in order to tie it to the data store
 *
 * @param label The label of the Select component
 * @param options An array of strings representing the options for the Select
 * component
 * @param path The path (consistent with the path provided to the lodash
 * get() method) to the datum within the data store for the Select component
 */
const SelectWrapper: React.FC<SelectWrapperProps> = ({
    label,
    options,
    path,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc, upsertData }) => {
                return (
                    <Select
                        label={label}
                        options={options}
                        value={doc && get(doc.data_, path)}
                        onChange={async value => await upsertData(path, value)}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default SelectWrapper
