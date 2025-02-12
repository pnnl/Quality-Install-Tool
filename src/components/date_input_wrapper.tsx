import { get } from 'lodash'
import React from 'react'

import DateInput from './date_input'
import { StoreContext } from '../providers/store_provider'

interface DateInputWrapperProps {
    label: React.ReactNode
    path: string
}

const DateInputWrapper: React.FC<DateInputWrapperProps> = ({ label, path }) => {
    return (
        <StoreContext.Consumer>
            {({ doc, upsertData }) => {
                return (
                    <DateInput
                        label={label}
                        value={doc && get(doc.data_, path)}
                        onChange={async value => upsertData(path, value)}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default DateInputWrapper
