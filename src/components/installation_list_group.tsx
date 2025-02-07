import PouchDB from 'pouchdb'
import React, { useCallback } from 'react'
import { TfiPencil, TfiTrash } from 'react-icons/tfi'
import { Button, ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import templatesConfig from '../templates/templates_config'
import { type Installation } from '../types/database.types'

interface InstallationListGroupProps {
    projectId: PouchDB.Core.DocumentId
    workflowName: keyof typeof templatesConfig
    installationDoc: PouchDB.Core.ExistingDocument<Installation> &
        PouchDB.Core.AllDocsMeta
    onEdit: () => void | Promise<void>
    onDelete: () => void | Promise<void>
}

const InstallationListGroup: React.FC<InstallationListGroupProps> = ({
    projectId,
    workflowName,
    installationDoc,
    onEdit,
    onDelete,
}) => {
    const handleEdit = useCallback(
        async (
            event: React.MouseEvent<HTMLButtonElement>,
        ): Promise<boolean> => {
            event.stopPropagation()
            event.preventDefault()

            onEdit && (await onEdit())

            return false
        },
        [onEdit],
    )

    const handleDelete = useCallback(
        async (
            event: React.MouseEvent<HTMLButtonElement>,
        ): Promise<boolean> => {
            event.stopPropagation()
            event.preventDefault()

            onDelete && (await onDelete())

            return false
        },
        [onDelete],
    )

    return (
        <ListGroup key={installationDoc._id}>
            <LinkContainer
                to={`/app/${projectId}/${workflowName}/${installationDoc._id}`}
            >
                <ListGroup.Item action={true}>
                    {installationDoc.metadata_.doc_name}
                    <span className="icon-container">
                        <Button variant="light" onClick={handleEdit}>
                            <TfiPencil size={22} />
                        </Button>
                        <Button variant="light" onClick={handleDelete}>
                            <TfiTrash size={22} />
                        </Button>
                    </span>
                </ListGroup.Item>
            </LinkContainer>
        </ListGroup>
    )
}

export default InstallationListGroup
