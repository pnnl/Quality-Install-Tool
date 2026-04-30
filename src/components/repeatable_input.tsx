import { get } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import DeleteConfirmationModal from './views/shared/delete_confirmation_modal'
import { TfiTrash } from 'react-icons/tfi'

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
    const [newlyAddedIndex, setNewlyAddedIndex] = useState<number | null>(null)

    useEffect(() => {
        if (newlyAddedIndex !== null && values.length > newlyAddedIndex) {
            setNewlyAddedIndex(null)
        }
    }, [newlyAddedIndex, values.length])

    const handleAdd = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            setNewlyAddedIndex(values.length)

            onAdd && (await onAdd())

            return false
        },
        [onAdd, values.length],
    )

    const [showDeleteModalIndex, setShowDeleteModalIndex] = useState<
        number | null
    >(null)

    const handleRemove = useCallback(
        (event: React.SyntheticEvent<EventTarget>) => {
            if (!(event.currentTarget instanceof HTMLButtonElement)) {
                return false
            }
            event.stopPropagation()
            event.preventDefault()
            const index = event.currentTarget.dataset.index
            if (index === undefined) {
                return false
            }
            const index_ = parseInt(index)
            if (!isNaN(index_)) {
                setShowDeleteModalIndex(index_)
            }
            return false
        },
        [],
    )

    const handleDeleteCancel = useCallback(() => {
        setShowDeleteModalIndex(null)
    }, [])

    const handleDeleteConfirm = useCallback(async () => {
        if (showDeleteModalIndex !== null && onRemove) {
            await onRemove(showDeleteModalIndex)
        }
        setShowDeleteModalIndex(null)
    }, [onRemove, showDeleteModalIndex])

    return (
        <>
            {values.map((value, index) => {
                const labelValue = labelPath && get(value, labelPath)

                return (
                    <React.Fragment key={index}>
                        <Collapsible
                            header={`${label} ${index + 1}${labelValue ? `: ${labelValue}` : ''}`}
                            defaultOpen={index === newlyAddedIndex}
                        >
                            <div className="d-flex justify-content-end">
                                <Button
                                    className="d-flex align-items-center"
                                    variant="outline-danger"
                                    onClick={handleRemove}
                                    data-index={index}
                                >
                                    <TfiTrash size={18} />
                                    <span className="ms-1">Remove</span>
                                </Button>
                            </div>
                            <div className="combustion_tests mt-2">
                                {React.Children.map(
                                    children,
                                    (child, childIndex) =>
                                        cloneElement(
                                            child as React.ReactElement<CloneableProps>,
                                            childIndex,
                                            index,
                                            `${path}[${index}]`,
                                        ),
                                )}
                            </div>
                        </Collapsible>
                        <DeleteConfirmationModal
                            label={
                                labelValue
                                    ? `${label} ${index + 1}: ${labelValue}`
                                    : `${label} ${index + 1}`
                            }
                            show={showDeleteModalIndex === index}
                            onCancel={handleDeleteCancel}
                            onHide={handleDeleteCancel}
                            onConfirm={handleDeleteConfirm}
                        />
                    </React.Fragment>
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
