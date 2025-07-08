import React, { useCallback, useId, useMemo } from 'react'
import { Button, Modal } from 'react-bootstrap'

import { type Validator, validate } from '../../../utilities/validation_utils'

interface StringInputModalProps {
    title: React.ReactNode
    cancelLabel: React.ReactNode
    confirmLabel: React.ReactNode
    value: string | undefined
    validators: Array<Validator<string>>
    show: boolean
    onCancel?: () => void | Promise<void>
    onConfirm?: () => void | Promise<void>
    onHide?: () => void | Promise<void>
    onChange?: (value: string) => void | Promise<void>
}

const StringInputModal: React.FC<StringInputModalProps> = ({
    title,
    cancelLabel,
    confirmLabel,
    value,
    validators,
    show,
    onCancel,
    onConfirm,
    onHide,
    onChange,
}) => {
    const id = useId()

    const errorMessages = useMemo<Array<string>>(() => {
        if (value === undefined) {
            return []
        } else {
            return validate(value, validators)
        }
    }, [value, validators])

    const handleCancel = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            onCancel && (await onCancel())

            return false
        },
        [onCancel],
    )

    const handleChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange && (await onChange(event.target.value))
        },
        [onChange],
    )

    const handleConfirm = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            onConfirm && (await onConfirm())

            return false
        },
        [onConfirm],
    )

    const handleHide = useCallback(async () => {
        onHide && (await onHide())
    }, [onHide])

    const handleKeyUp = useCallback(
        async (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' && errorMessages.length === 0) {
                onConfirm && (await onConfirm())
            }
        },
        [errorMessages.length, onConfirm],
    )

    return (
        <Modal show={show} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    id={id}
                    type="text"
                    value={value ?? ''}
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                    autoFocus
                />
                {errorMessages.length > 0 && (
                    <div className="error">{errorMessages.join(' ')}</div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    {cancelLabel}
                </Button>
                <Button
                    variant="danger"
                    disabled={errorMessages.length > 0}
                    onClick={handleConfirm}
                >
                    {confirmLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default StringInputModal
