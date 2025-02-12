import { get } from 'lodash'
import React from 'react'

import ShowOrHide, { type MatchConditions } from './show_or_hide'
import { StoreContext } from '../providers/store_provider'

interface ShowOrHideWrapperProps {
    children: React.ReactNode
    visible: boolean
    path?: string
    value?: string | string[] // value can be a single string or an array of strings
    parent?: any
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
                        children={children}
                        visible={visible}
                        pathValue={path ? get(currentData, path) : undefined}
                        value={value}
                        matchCondition={matchCondition}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default ShowOrHideWrapper
