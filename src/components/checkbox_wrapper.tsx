import { get } from 'lodash'
import React from 'react'

import Checkbox from './checkbox'
import { StoreContext } from '../providers/store_provider'

interface CheckboxWrapperProps {
    label: string
    options: string[]
    path: string
    default_value?: string[]
    hidden?: boolean
}

const CheckboxWrapper: React.FC<CheckboxWrapperProps> = ({
    label,
    options,
    path,
    default_value,
    hidden,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc, upsertData }) => {
                return (
                    <Checkbox
                        label={label}
                        options={options}
                        onChange={async value =>
                            await upsertData(path, value, [])
                        }
                        value={
                            (doc && get(doc.data_, path)) ?? default_value ?? []
                        }
                        hidden={hidden}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default CheckboxWrapper
