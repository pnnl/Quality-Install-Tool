import { get } from 'lodash'
import PouchDB from 'pouchdb'
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
}

const LabelValueWrapper: React.FC<LabelValueWrapperProps> = ({
    label,
    path,
    prefix,
    suffix,
    parent = null,
    required = false,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                const value = get(
                    parent ? parent.data_ : doc ? doc.data_ : undefined,
                    path,
                )

                return (
                    <LabelValue
                        label={label}
                        value={value}
                        required={required}
                        prefix={prefix}
                        suffix={suffix}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default LabelValueWrapper
