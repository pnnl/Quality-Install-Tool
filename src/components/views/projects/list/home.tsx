import PouchDB from 'pouchdb'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ImportDoc from './import_document'
import NewProjectButton from './new_project_button'
import ProjectListGroup from './project_list_group'
import DeleteConfirmationModal from '../../shared/delete_confirmation_modal'
import { useDatabase } from '../../../../providers/database_provider'
import {
    type ProjectDocument,
    useProjects,
} from '../../../../providers/projects_provider'
import {
    getProject,
    putNewProject,
    removeProject,
} from '../../../../utilities/database_utils'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
    const db = useDatabase()

    const navigate = useNavigate()

    const [projects, setProjects] = useProjects()

    const [selectedProject, setSelectedProject] = useState<
        ProjectDocument | undefined
    >(undefined)

    return (
        <>
            <DeleteConfirmationModal
                label={selectedProject?.metadata_?.doc_name ?? ''}
                show={selectedProject !== undefined}
                onHide={() => setSelectedProject(undefined)}
                onCancel={() => setSelectedProject(undefined)}
                onConfirm={async () => {
                    if (selectedProject) {
                        await removeProject(db, selectedProject._id)

                        setProjects(previousProjects => {
                            return previousProjects.filter(previousProject => {
                                return (
                                    previousProject._id !== selectedProject._id
                                )
                            })
                        })

                        setSelectedProject(undefined)
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
                            For your records
                            <br />
                            For your clients
                            <br />
                            For quality assurance reporting
                        </p>
                        <div className="button-container-center">
                            <NewProjectButton
                                label="Add a New Project"
                                altText="Add a New Project"
                                onClick={async () => {
                                    const project = await putNewProject(
                                        db,
                                        '',
                                        undefined,
                                    )

                                    navigate(`app/${project._id}`, {
                                        replace: true,
                                    })
                                }}
                            />
                            &nbsp;&nbsp;
                            <ImportDoc
                                label="Import a Project"
                                onImport={async (
                                    projectId: PouchDB.Core.DocumentId,
                                ) => {
                                    const project = await getProject(
                                        db,
                                        projectId,
                                    )

                                    setProjects(previousProjects => {
                                        return [project, ...previousProjects]
                                    })
                                }}
                            />
                        </div>
                    </center>
                </div>
            ) : (
                <div>
                    <div className="align-right padding">
                        <NewProjectButton
                            label="Add a New Project"
                            altText="Add a New Project"
                            onClick={async () => {
                                const project = await putNewProject(
                                    db,
                                    '',
                                    undefined,
                                )

                                navigate(`app/${project._id}`, {
                                    replace: true,
                                })
                            }}
                        />
                        &nbsp;&nbsp;
                        <ImportDoc
                            label="Import Project"
                            onImport={async (
                                projectId: PouchDB.Core.DocumentId,
                            ) => {
                                const project = await getProject(db, projectId)

                                setProjects(previousProjects => {
                                    return [project, ...previousProjects]
                                })
                            }}
                        />
                    </div>
                    <div>
                        {projects.map(project => (
                            <ProjectListGroup
                                key={project._id}
                                project={project}
                                onEdit={() =>
                                    navigate(`app/${project._id}`, {
                                        replace: true,
                                    })
                                }
                                onDelete={() => setSelectedProject(project)}
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
