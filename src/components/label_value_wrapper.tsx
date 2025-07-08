import { get } from 'lodash'
import React from 'react'

import LabelValue from './label_value'
import { StoreContext } from '../providers/store_provider'
import { type Base } from '../types/database.types'

interface LabelValueWrapperProps {
    label: string
    path: string
    prefix?: string
    suffix?: string
    required?: boolean
    parent?: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta
    value?: string | number | boolean
    type?: 'string' | 'number' | 'date'
    decimalPlaces?: number
    dateOptions?: Intl.DateTimeFormatOptions
}

const LabelValueWrapper: React.FC<LabelValueWrapperProps> = ({
    label,
    path,
    prefix,
    suffix,
    parent = null,
    required = false,
    decimalPlaces,
    type = 'string',
    dateOptions,
    value,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                const computedValue = value
                    ? value
                    : get(
                          parent ? parent.data_ : doc ? doc.data_ : undefined,
                          path,
                      )

                return (
                    <LabelValue
                        label={label}
                        value={computedValue}
                        required={required}
                        prefix={prefix}
                        suffix={suffix}
                        decimalPlaces={decimalPlaces}
                        type={type}
                        dateOptions={dateOptions}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default LabelValueWrapper
