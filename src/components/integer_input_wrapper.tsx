import { get } from 'lodash'
import type { FC } from 'react'
import { StoreContext } from './store'
import IntegerInput from './integer_input'
import { pathToId } from '../utilities/paths_utils'

interface IntegerInputWrapperProps {
    label: string
    path: string
    prefix: string
    suffix: string
    min: number
    max: number
    hint: string
}

/**
 * A component that wraps a IntegerInput component in order to tie it to the data store
 *
 * @param label The label of the IntegerInput component
 * @param path The path (consistent with the path provided to the lodash
 * get() method) to the datum within the data store for the IntegerInput
 * component
 * @param prefix Text to appear as a prefix to the IntegerInput (e.g. '$' if the input
 * represents a number of dollars)
 * @param suffix Text to appear as a suffix to the IntegerInput (e.g. 'SqFt')
 * @param min The minimum allowed value for the input field, defult to NEGATIVE_INFINITY.
 * @param max The maximum allowed value for the input field, defult to POSITIVE_INFINITY.
 * @param hint Displays hint text for the component.
 */

const IntegerInputWrapper: FC<IntegerInputWrapperProps> = ({
    label,
    path,
    prefix,
    suffix,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    hint,
}) => {
    // Generate an id for the input
    const id = pathToId(path, 'input')

    return (
        <StoreContext.Consumer>
            {({ data, upsertData }) => {
                return (
                    <IntegerInput
                        id={id}
                        label={label}
                        prefix={prefix}
                        suffix={suffix}
                        updateValue={(value: any) => {
                            upsertData(path, parseFloat(value))
                        }}
                        value={get(data, path)}
                        min={min}
                        max={max}
                        hint={hint}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default IntegerInputWrapper
