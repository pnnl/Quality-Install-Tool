import { get } from 'lodash'
import React, {FC} from 'react'

import {StoreContext} from './store'
import NumberInput from './number_input'
import {pathToId} from '../utilities/paths_utils'

interface NumberInputWrapperProps {
  label: string,
  path: string,
  prefix: string,
  suffix: string,
  min: number,
  max: number
}

/**
 * A component that wraps a NumberInput component in order to tie it to the data store
 * 
 * @param label The label of the NumberInput component
 * @param path The path (consistent with the path provided to the lodash
 * get() method) to the datum within the data store for the NumberInput 
 * component
 * @param prefix Text to appear as a prefix to the NumberInput (e.g. "$" if the input
 * represents a number of dollars)
 * @param suffix Text to appear as a suffix to the NumberInput (e.g. "SqFt")
 * @param min The minimum allowed value for the input field, defult to NEGATIVE_INFINITY.
 * @param max The maximum allowed value for the input field, defult to POSITIVE_INFINITY.
 */
const NumberInputWrapper: FC<NumberInputWrapperProps> = ({label, path, prefix, suffix, min=Number.NEGATIVE_INFINITY, max=Number.POSITIVE_INFINITY}) => {

  // Generate an id for the input
  path = "data_."+path // DB datastructure change
  const id = pathToId(path, "input")

  return (
    <StoreContext.Consumer>
      {({doc, upsertData}) => {
          return (
            <NumberInput id={id} label={label} prefix={prefix} suffix={suffix}
              updateValue= {(value: any) => upsertData(path, parseFloat(value))}
              value = {get(doc, path)} min={min} max={max}/>
          )
        }
      }
    </StoreContext.Consumer>

)}


export default NumberInputWrapper
