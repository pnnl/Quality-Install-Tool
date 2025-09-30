import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import ImportDoc from './import_document'
import ProjectListGroup from './project_list_group'
import DeleteConfirmationModal from '../../shared/delete_confirmation_modal'
import { useDatabase } from '../../../../providers/database_provider'
import {
    type ProjectDocument,
    useProjects,
} from '../../../../providers/projects_provider'
import { removeProject } from '../../../../utilities/database_utils'

type HomeProps = Record<string, never>

const Home: React.FC<HomeProps> = () => {
    const db = useDatabase()

    const navigate = useNavigate()

    const [projects, setProjects, reloadProjects] = useProjects()

    const [selectedProjectForDelete, setSelectedProjectForDelete] = useState<
        ProjectDocument | undefined
    >(undefined)

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
                    <div className="align-right padding">
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
                    <div>
                        {projects.map(project => (
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
                </div>
            )}
            <br />
            <center>
                <p className="welcome-content">
                    <br />
                    Click here to learn more about the{' '}
                    <a
                        href={process.env.REACT_APP_HOMEPAGE}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {process.env.REACT_APP_NAME}
                    </a>
                </p>
            </center>
        </>
    )
}

export default Home
