import React from 'react'

import { type CloneableProps, cloneElement } from '../utilities/cloning_utils'

interface RepeatableProps {
    path: string
    keys: React.Key[]
    children: React.ReactNode
}

const Repeatable: React.FC<RepeatableProps> = ({ path, keys, children }) => {
    return keys.map(key => (
        <div key={key}>
            {React.Children.map(children, (child, childIndex) => {
                return cloneElement(
                    child as React.ReactElement<CloneableProps>,
                    childIndex,
                    key,
                    `${path}[${key}]`,
                )
            })}
            <br />
        </div>
    ))
}

export default Repeatable
