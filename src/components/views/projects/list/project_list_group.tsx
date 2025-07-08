import React, { useCallback } from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import { TfiPencil, TfiTrash } from 'react-icons/tfi'
import { LinkContainer } from 'react-router-bootstrap'

import ExportDoc from './export_document'
import LocationStr from '../../../location_str'
import { type ProjectDocument } from '../../../../providers/projects_provider'
import { someLocation } from '../../../../utilities/location_utils'

interface ProjectListGroupProps {
    onEdit?: () => void | Promise<void>
    onDelete?: () => void | Promise<void>
    project: ProjectDocument
}

const ProjectListGroup: React.FC<ProjectListGroupProps> = ({
    project,
    onEdit,
    onDelete,
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
        <ListGroup className="padding">
            <LinkContainer to={`/app/${project._id}/workflows`}>
                <ListGroup.Item action={true}>
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
                        <ExportDoc projectId={project._id} />
                    </span>
                    <b>{project.metadata_.doc_name}</b>
                    {project.data_.location &&
                        someLocation(project.data_.location) && (
                            <>
                                <br />
                                <LocationStr
                                    location={project.data_.location}
                                    separators={[<br key={0} />, ', ', ' ']}
                                />
                            </>
                        )}
                </ListGroup.Item>
            </LinkContainer>
        </ListGroup>
    )
}

export default ProjectListGroup
