import PouchDB from 'pouchdb'
import React, { useCallback } from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import { TfiPencil, TfiTrash } from 'react-icons/tfi'
import { LinkContainer } from 'react-router-bootstrap'

import ExportDoc from './export_document'
import LocationStr from './location_str'
import { type Project } from '../types/database.types'
import { hasLocation } from '../utilities/location_utils'

interface ProjectListGroupProps {
    projectDoc: PouchDB.Core.ExistingDocument<Project> &
        PouchDB.Core.AllDocsMeta
    onEdit: () => void | Promise<void>
    onDelete: () => void | Promise<void>
}

const ProjectListGroup: React.FC<ProjectListGroupProps> = ({
    projectDoc,
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
        <ListGroup key={projectDoc._id} className="padding">
            <LinkContainer to={`/app/${projectDoc._id}/workflows`}>
                <ListGroup.Item action={true}>
                    <span className="icon-container">
                        <Button variant="light" onClick={handleEdit}>
                            <TfiPencil size={22} />
                        </Button>
                        <Button variant="light" onClick={handleDelete}>
                            <TfiTrash size={22} />
                        </Button>
                        <ExportDoc
                            projectId={projectDoc._id}
                            includeInstallations={true}
                        />
                    </span>
                    <b>{projectDoc.metadata_.doc_name}</b>
                    {projectDoc.data_.location && (
                        <>
                            {hasLocation(projectDoc.data_.location) && <br />}
                            <LocationStr location={projectDoc.data_.location} />
                        </>
                    )}
                </ListGroup.Item>
            </LinkContainer>
        </ListGroup>
    )
}

export default ProjectListGroup
