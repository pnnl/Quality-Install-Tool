import { get } from 'lodash'
import React, { useCallback } from 'react'
import { Button } from 'react-bootstrap'

import Collapsible from './collapsible'
import { type CloneableProps, cloneElement } from '../utilities/cloning_utils'

interface RepeatableProps {
    path: string
    label: string
    labelPath?: string
    maxValuesCount?: number
    values: object[]
    onAdd?: () => Promise<void>
    onRemove?: (index: number) => Promise<void>
    children: React.ReactNode
}

const RepeatableInput: React.FC<RepeatableProps> = ({
    label,
    labelPath,
    path,
    maxValuesCount,
    values,
    onAdd,
    onRemove,
    children,
}) => {
    const handleAdd = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            onAdd && (await onAdd())

            return false
        },
        [onAdd],
    )

    const handleRemove = useCallback(
        async (event: React.SyntheticEvent<EventTarget>) => {
            if (!(event.target instanceof HTMLButtonElement)) {
                return false
            }

            event.stopPropagation()
            event.preventDefault()

            const index = event.target.dataset.index

            if (index === undefined) {
                return false
            }

            const index_ = parseInt(index)

            if (!isNaN(index_)) {
                onRemove && (await onRemove(index_))
            }

            return false
        },
        [onRemove],
    )

    return (
        <>
            {values.map((value, index) => {
                const labelValue = labelPath && get(value, labelPath)

                return (
                    <Collapsible
                        key={index}
                        header={`${label} ${index + 1}${labelValue ? `: ${labelValue}` : ''}`}
                    >
                        <div className="combustion_tests">
                            {React.Children.map(children, (child, childIndex) =>
                                cloneElement(
                                    child as React.ReactElement<CloneableProps>,
                                    childIndex,
                                    index,
                                    `${path}[${index}]`,
                                ),
                            )}
                        </div>
                        <div>
                            <Button
                                className="remove-button"
                                onClick={handleRemove}
                                data-index={index}
                            >
                                Remove {label}
                            </Button>
                        </div>
                    </Collapsible>
                )
            })}
            {(maxValuesCount === undefined ||
                values.length < maxValuesCount) && (
                <Button
                    className="padding"
                    variant="primary"
                    onClick={handleAdd}
                >
                    Add {label}
                </Button>
            )}
        </>
    )
}

export default RepeatableInput
