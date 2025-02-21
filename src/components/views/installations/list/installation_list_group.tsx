import React, { useCallback } from 'react'
import { TfiPencil, TfiTrash } from 'react-icons/tfi'
import { Button, ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

interface InstallationListGroupProps {
    onEdit?: () => void | Promise<void>
    onDelete?: () => void | Promise<void>
    to: string
    children: React.ReactNode
}

const InstallationListGroup: React.FC<InstallationListGroupProps> = ({
    onEdit,
    onDelete,
    to,
    children,
}) => {
    const handleEdit = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            onEdit && (await onEdit())

            return false
        },
        [onEdit],
    )

    const handleDelete = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            onDelete && (await onDelete())

            return false
        },
        [onDelete],
    )

    return (
        <ListGroup>
            <LinkContainer to={to}>
                <ListGroup.Item action={true}>
                    {(onEdit || onDelete) && (
                        <span className="icon-container">
                            {onEdit && (
                                <Button variant="light" onClick={handleEdit}>
                                    <TfiPencil size={22} />
                                </Button>
                            )}
                            {onDelete && (
                                <Button variant="light" onClick={handleDelete}>
                                    <TfiTrash size={22} />
                                </Button>
                            )}
                        </span>
                    )}
                    {children}
                </ListGroup.Item>
            </LinkContainer>
        </ListGroup>
    )
}

export default InstallationListGroup
