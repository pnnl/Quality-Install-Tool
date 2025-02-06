import React, { useCallback } from 'react'
import { Button, Modal } from 'react-bootstrap'

interface DeleteConfirmationModalProps {
    label: string
    show: boolean
    onCancel: () => void
    onConfirm: () => Promise<void>
    onHide: () => void
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    label,
    show,
    onCancel,
    onConfirm,
    onHide,
}) => {
    const handleCancel = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>): boolean => {
            event.stopPropagation()
            event.preventDefault()

            onCancel && onCancel()

            return false
        },
        [onCancel],
    )

    const handleConfirm = useCallback(
        async (
            event: React.MouseEvent<HTMLButtonElement>,
        ): Promise<boolean> => {
            event.stopPropagation()
            event.preventDefault()

            onConfirm && (await onConfirm())

            return false
        },
        [onConfirm],
    )

    const handleHide = useCallback((): void => {
        onHide && onHide()
    }, [onHide])

    return (
        <Modal show={show} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to permanently delete <b>{label}</b>? This
                action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleConfirm}>
                    Permanently Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteConfirmationModal
