import { get } from 'lodash'
import type { FC } from 'react'

import DateInput from './date_input'
import { StoreContext } from './store'
import { pathToId } from '../utilities/path_utils'

interface DateInputWrapperProps {
    label: string
    path: string
}

/**
 * A component that wraps a DataInput component in order to tie it to the data store
 *
 * @param label The label of the DataInput component
 * @param path The path (consistent with the path provided to the lodash
 * get() method) to the datum within the data store for the DataInput
 * component
 */
const DateInputWrapper: FC<DateInputWrapperProps> = ({ label, path }) => {
    // Generate an id for the input
    const id = pathToId(path, 'input')
    return (
        <StoreContext.Consumer>
            {({ data, upsertData }) => {
                return (
                    <DateInput
                        id={id}
                        label={label}
                        handleValueChange={(value: any) => {
                            upsertData(path, value)
                        }}
                        value={get(data, path)}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default DateInputWrapper
