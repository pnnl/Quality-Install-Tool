import { get } from 'lodash'
import React from 'react'

import RepeatableInput from './repeatable_input'
import { StoreContext } from '../providers/store_provider'

interface RepeatableInputWrapperProps {
    path: string
    label: string
    labelPath?: string
    children: React.ReactNode
    maxValuesCount: number
}

const RepeatableInputWrapper: React.FC<RepeatableInputWrapperProps> = ({
    path,
    label,
    labelPath,
    children,
    maxValuesCount,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc, upsertData }) => {
                return (
                    <RepeatableInput
                        path={path}
                        label={label}
                        labelPath={labelPath}
                        maxValuesCount={maxValuesCount}
                        values={(doc && get(doc.data_, path)) ?? []}
                        onAdd={async () => {
                            if (doc) {
                                const values = [...(get(doc.data_, path) ?? [])]

                                values.splice(values.length, 0, {})

                                await upsertData(path, values)
                            }
                        }}
                        onRemove={async (index: number) => {
                            if (doc) {
                                const values = [...(get(doc.data_, path) ?? [])]

                                values.splice(index, 1)

                                await upsertData(path, values)
                            }
                        }}
                    >
                        {children}
                    </RepeatableInput>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default RepeatableInputWrapper
