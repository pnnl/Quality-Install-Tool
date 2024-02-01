import { get } from 'lodash'
import type { FC } from 'react'

import DateInput from './date_input'
import { StoreContext } from './store'
import { pathToId } from '../utilities/paths_utils'
import DropDownMenu from './dropdown_menu'

interface DropDownMenuWrapperProps {
    label: string
    path: string
    children: React.ReactNode
}

const DropDownMenuWrapper: FC<DropDownMenuWrapperProps> = ({ label, path }) => {
    // Generate an id for the input
    const id = pathToId(path, 'input')
    return (
        <StoreContext.Consumer>
            {({ data, upsertData }) => {
                return (
                    <DropDownMenu
                        id={id}
                        label={label}
                        value={children}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default DropDownMenuWrapper
