import { get } from 'lodash'
import React from 'react'

import Radio from './radio'
import { StoreContext } from '../providers/store_provider'

interface RadioWrapperProps {
    label: React.ReactNode
    options: string[]
    path: string
}

const RadioWrapper: React.FC<RadioWrapperProps> = ({
    label,
    options,
    path,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc, upsertData }) => {
                return (
                    <Radio
                        label={label}
                        options={options}
                        onChange={async value =>
                            await upsertData(path, value, [])
                        }
                        value={doc && get(doc.data_, path)}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default RadioWrapper
