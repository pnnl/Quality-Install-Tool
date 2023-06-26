import { get } from 'lodash'
import React, {FC} from 'react'

import {StoreContext} from './store'
import Select from './select'
import {pathToId} from '../utilities/paths_utils'

interface SelectWrapperProps {
  label: string,
  options: string[]
  path: string,
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
const SelectWrapper: FC<SelectWrapperProps> = ({label, options, path}) => {

  // Generate an id for the input
  path = "data_."+path // DB datastructure change
  const id = pathToId(path, "input")

  return (
    <StoreContext.Consumer>
      {({doc, upsertData}) => {
          return (
            <Select id={id} label={label} 
              options={options}
              updateValue= {(value: any) => upsertData(path, value)}
              value = {get(doc, path)}/>
          )
        }
      }
    </StoreContext.Consumer>

)}


export default SelectWrapper
