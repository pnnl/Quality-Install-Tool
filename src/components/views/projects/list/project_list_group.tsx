import React, { useCallback } from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import { TfiPencil, TfiTrash } from 'react-icons/tfi'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'

import ExportDoc from './export_document'
import LocationStr from '../../../location_str'
import { type ProjectDocument } from '../../../../providers/projects_provider'
import { someLocation } from '../../../../utilities/location_utils'

interface ProjectListGroupProps {
    onEdit?: () => void | Promise<void>
    onDelete?: () => void | Promise<void>
    onDownload?: () => void | Promise<void>
    project: ProjectDocument
}

const ProjectListGroup: React.FC<ProjectListGroupProps> = ({
    project,
    onEdit,
    onDelete,
    onDownload,
}) => {
    const navigate = useNavigate()
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

    const shouldShowDownloadSuggested = () => {
        if (
            project.metadata_.is_downloaded &&
            project.metadata_.last_downloaded_date
        ) {
            const lastDownloaded = new Date(
                project.metadata_.last_downloaded_date,
            )
            const lastModified = new Date(project.metadata_.last_modified_at)
            return lastModified > lastDownloaded
        }
        return false
    }

    const shouldShowDownloadAlert = () => {
        return !project.metadata_.is_downloaded
    }

    return (
        <ListGroup className="padding">
            <LinkContainer to={`/app/${project._id}/workflows`}>
                <ListGroup.Item action={true}>
                    <span className="icon-container">
                        <div className="align-right">
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
                            <ExportDoc
                                projectId={project._id}
                                variant="light"
                                onDownload={onDownload}
                                showAlert={
                                    shouldShowDownloadSuggested() ||
                                    shouldShowDownloadAlert()
                                }
                            />
                        </div>
                        <div>
                            {shouldShowDownloadSuggested() ? (
                                <Button
                                    variant="light"
                                    className="download-button"
                                    onClick={event => {
                                        event.stopPropagation()
                                        event.preventDefault()
                                        navigate(
                                            `/app/${project._id}/download-reminder/fromHome`,
                                        )
                                    }}
                                >
                                    <span className="download-status-capsule">
                                        Download Suggested
                                    </span>
                                </Button>
                            ) : (
                                shouldShowDownloadAlert() && (
                                    <span className="download-status-capsule">
                                        Never Been Downloaded
                                    </span>
                                )
                            )}
                        </div>
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
