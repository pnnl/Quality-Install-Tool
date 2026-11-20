import React, { useEffect, useState } from 'react'
import { Button, Form, Pagination } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import ImportDoc from './import_document'
import ProjectListGroup from './project_list_group'
import DeleteConfirmationModal from '../../shared/delete_confirmation_modal'
import { useDatabase } from '../../../../providers/database_provider'
import {
    type ProjectDocument,
    useProjects,
} from '../../../../providers/projects_provider'
import {
    removeProject,
    updateProjectLastModified,
} from '../../../../utilities/database_utils'

type HomeProps = Record<string, never>

const PROJECTS_PER_PAGE = 25

const Home: React.FC<HomeProps> = () => {
    const db = useDatabase()

    const navigate = useNavigate()

    const [projects, setProjects, reloadProjects] = useProjects()

    const [selectedProjectForDelete, setSelectedProjectForDelete] = useState<
        ProjectDocument | undefined
    >(undefined)

    const [currentPage, setCurrentPage] = useState(1)

    const [searchText, setSearchText] = useState('')

    const normalizedSearch = searchText.trim().toLowerCase()
    const filteredProjects = normalizedSearch
        ? projects.filter(project =>
              (project.metadata_.doc_name ?? '')
                  .toLowerCase()
                  .includes(normalizedSearch),
          )
        : projects

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE),
    )
    const page = Math.min(currentPage, totalPages)
    const pageProjects = filteredProjects.slice(
        (page - 1) * PROJECTS_PER_PAGE,
        page * PROJECTS_PER_PAGE,
    )

    useEffect(() => {
        let isCancelled = false

        const syncProjectMetadata = async () => {
            await Promise.all(
                projects.map(async project => {
                    try {
                        await updateProjectLastModified(db, project)
                    } catch (error) {
                        const dbError = error as PouchDB.Core.Error

                        if (
                            dbError.status === 404 ||
                            dbError.name === 'not_found' ||
                            dbError.reason === 'deleted'
                        ) {
                            return
                        }

                        console.error(
                            'Failed to update project metadata:',
                            error,
                        )
                    }
                }),
            )

            if (!isCancelled) {
                await reloadProjects()
            }
        }

        void syncProjectMetadata()

        return () => {
            isCancelled = true
        }
    }, [projects, db, reloadProjects])

    return (
        <>
            <DeleteConfirmationModal
                label={selectedProjectForDelete?.metadata_?.doc_name ?? ''}
                show={selectedProjectForDelete !== undefined}
                onHide={() => setSelectedProjectForDelete(undefined)}
                onCancel={() => setSelectedProjectForDelete(undefined)}
                onConfirm={async () => {
                    if (selectedProjectForDelete) {
                        await removeProject(db, selectedProjectForDelete._id)

                        // Compact the database after deletion to free space
                        // occupied by orphaned attachment blobs and tombstones.
                        // Dispatch an event when done so the footer refreshes
                        // the storage usage display immediately.
                        const compactAndNotify = async () => {
                            try {
                                await db.compact()
                                window.dispatchEvent(
                                    new CustomEvent('pouchdb-compacted'),
                                )
                            } catch (error) {
                                console.error(
                                    'Database compaction failed:',
                                    error,
                                )
                            }
                        }
                        void compactAndNotify()

                        setProjects(previousProjects => {
                            return previousProjects.filter(previousProject => {
                                return (
                                    previousProject._id !==
                                    selectedProjectForDelete._id
                                )
                            })
                        })

                        setSelectedProjectForDelete(undefined)
                    }
                }}
            />
            {projects.length === 0 ? (
                <div>
                    <center>
                        <br />
                        <p className="welcome-header">
                            Welcome to the {process.env.REACT_APP_NAME}
                        </p>
                        <br />
                        <p className="welcome-content">
                            With this tool you will be able
                            <br />
                            to easily take photos and document
                            <br />
                            your entire installation project.
                            <br />
                            <br />
                            <br />
                            For your records.
                            <br />
                            For your clients.
                            <br />
                            For quality assurance reporting.
                        </p>
                        <br />
                        <div className="button-container-center">
                            <Button
                                onClick={() => {
                                    navigate('/app/new', {
                                        replace: true,
                                    })
                                }}
                            >
                                New Project
                            </Button>
                            &nbsp;&nbsp;
                            <ImportDoc
                                label="Import Project"
                                onImport={async () => {
                                    await reloadProjects()
                                }}
                            />
                        </div>
                    </center>
                </div>
            ) : (
                <div>
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 padding">
                        <span data-testid="project-count">
                            Saved Projects: {projects.length}
                            {normalizedSearch &&
                                ` · ${filteredProjects.length} found`}
                        </span>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <Button
                                onClick={() => {
                                    navigate('/app/new', {
                                        replace: true,
                                    })
                                }}
                            >
                                New Project
                            </Button>
                            <ImportDoc
                                label="Import Project"
                                onImport={async () => {
                                    await reloadProjects()
                                }}
                            />
                        </div>
                    </div>
                    <div className="padding">
                        <Form.Control
                            type="search"
                            placeholder="Search projects by name"
                            aria-label="Search projects by name"
                            value={searchText}
                            onChange={event => {
                                setSearchText(event.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>
                    {normalizedSearch && filteredProjects.length === 0 && (
                        <p className="padding" data-testid="no-search-results">
                            No projects match &quot;{searchText.trim()}&quot;.
                        </p>
                    )}
                    <div>
                        {pageProjects.map(project => (
                            <ProjectListGroup
                                key={project._id}
                                project={project}
                                onEdit={() =>
                                    navigate(`/app/${project._id}`, {
                                        replace: true,
                                    })
                                }
                                onDelete={() =>
                                    setSelectedProjectForDelete(project)
                                }
                                onDownload={async () => {
                                    await reloadProjects()
                                }}
                            />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <Pagination
                            className="justify-content-center"
                            data-testid="project-pagination"
                        >
                            <Pagination.Prev
                                disabled={page === 1}
                                onClick={() => setCurrentPage(page - 1)}
                            />
                            {Array.from({ length: totalPages }, (_, i) => {
                                const first = i * PROJECTS_PER_PAGE + 1
                                const last = Math.min(
                                    (i + 1) * PROJECTS_PER_PAGE,
                                    filteredProjects.length,
                                )

                                return (
                                    <Pagination.Item
                                        key={i + 1}
                                        active={i + 1 === page}
                                        title={`Projects ${first}-${last}`}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {last}
                                    </Pagination.Item>
                                )
                            })}
                            <Pagination.Next
                                disabled={page === totalPages}
                                onClick={() => setCurrentPage(page + 1)}
                            />
                        </Pagination>
                    )}
                </div>
            )}
        </>
    )
}

export default Home
