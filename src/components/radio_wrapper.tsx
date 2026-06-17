import { get } from 'lodash'
import React from 'react'

import Radio, { type RadioOption } from './radio'
import { StoreContext } from '../providers/store_provider'
import { normalizePhotoResolution } from '../utilities/photo_resolution_utils'

interface RadioWrapperProps {
    label: React.ReactNode
    options: Array<string | RadioOption>
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
                const rawValue = doc && get(doc.data_, path)
                const value =
                    path === 'photo.resolution'
                        ? normalizePhotoResolution(rawValue)
                        : rawValue

                return (
                    <Radio
                        label={label}
                        options={options}
                        onChange={async value =>
                            await upsertData(path, value, [])
                        }
                        value={value}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default RadioWrapper
