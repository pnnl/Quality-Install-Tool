import { get } from 'lodash'
import PouchDB from 'pouchdb'
import React from 'react'

import ShowOrHide, { type MatchConditions } from './show_or_hide'
import { StoreContext } from '../providers/store_provider'
import { type Base } from '../types/database.types'

interface ShowOrHideWrapperProps {
    children: React.ReactNode
    visible: boolean
    path?: string
    value?: string | string[] // value can be a single string or an array of strings
    parent?: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta
    matchCondition?: MatchConditions // Optional condition (default: 'Equals')
}

const ShowOrHideWrapper: React.FC<ShowOrHideWrapperProps> = ({
    children,
    visible,
    path,
    value,
    parent,
    matchCondition = 'Equals',
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                const currentData = parent
                    ? parent.data_
                    : doc
                      ? doc.data_
                      : undefined

                return (
                    <ShowOrHide
                        visible={visible}
                        pathValue={path ? get(currentData, path) : undefined}
                        value={value}
                        matchCondition={matchCondition}
                    >
                        {children}
                    </ShowOrHide>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default ShowOrHideWrapper
