import { get } from 'lodash'
import React from 'react'
import PouchDB from 'pouchdb'

import Repeatable from './repeatable'
import { StoreContext } from '../providers/store_provider'
import { type Base } from '../types/database.types'

interface RepeatableWrapperProps {
    path: string
    children: React.ReactNode
    label?: string
    parent?: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta
}

const RepeatableWrapper: React.FC<RepeatableWrapperProps> = ({
    path,
    children,
    label,
    parent,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                const sourceDoc = parent ?? doc

                return (
                    <Repeatable
                        path={path}
                        label={label}
                        keys={Object.keys(
                            (sourceDoc && get(sourceDoc.data_, path)) ?? {},
                        )}
                    >
                        {children}
                    </Repeatable>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default RepeatableWrapper
