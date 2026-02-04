import React from 'react'

import { type CloneableProps, cloneElement } from '../utilities/cloning_utils'
import LabelValue from './label_value'

interface RepeatableProps {
    path: string
    keys: React.Key[]
    children: React.ReactNode
    label?: string
}

const Repeatable: React.FC<RepeatableProps> = ({
    path,
    keys,
    children,
    label,
}) => {
    return keys.map(key => (
        <div key={key}>
            {label && (
                <LabelValue label={label} value={String(Number(key) + 1)} />
            )}
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
