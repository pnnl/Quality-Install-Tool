import React from 'react'
import { Card } from 'react-bootstrap'
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
        <Card className="repeatable-card mb-3" key={key}>
            <Card.Body>
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
            </Card.Body>
        </Card>
    ))
}

export default Repeatable
