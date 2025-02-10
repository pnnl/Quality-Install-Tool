import PouchDB from 'pouchdb'
import React, { useCallback, useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import ImportDoc from './import_document'
import ProjectListGroup from './project_list_group'
import DeleteConfirmationModal from '../../shared/delete_confirmation_modal'
import StringInputModal from '../../shared/string_input_modal'
import { useDatabase } from '../../../../providers/database_provider'
import {
    type ProjectDocument,
    useProjects,
} from '../../../../providers/projects_provider'
import { type Project } from '../../../../types/database.types'
import {
    getProject,
    newProject,
    putProject,
    removeProject,
    setDocumentName,
} from '../../../../utilities/database_utils'
import { type Validator } from '../../../../utilities/validation_utils'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
    const db = useDatabase()

    const navigate = useNavigate()

    const [projects, setProjects, reloadProjects] = useProjects()

    const [isProjectForAddModalVisible, setIsProjectForAddModalVisible] =
        useState<boolean>(false)
    const [projectForAddModalValue, setProjectForAddModalValue] =
        useState<string>('')
    const [projectForRenameModalValue, setProjectForRenameModalValue] =
        useState<string>('')
    const [selectedProjectForDelete, setSelectedProjectForDelete] = useState<
        ProjectDocument | undefined
    >(undefined)
    const [selectedProjectForRename, setSelectedProjectForRename] = useState<
        ProjectDocument | undefined
    >(undefined)

    const projectNameValidators = useMemo<Array<Validator<string>>>(() => {
        const re = /^(?![\s-])[a-z0-9, -]{1,64}$/i

        const projectNames = projects.map(project => {
            return project.metadata_.doc_name
        })

        return [
            input => {
                if (re.test(input)) {
                    return undefined
                } else {
                    return 'The project name must be no more than 64 characters consisting of letters, numbers, dashes, and single spaces. Single spaces can only appear between other characters.'
                }
            },
            input => {
                if (projectNames.includes(input.trim())) {
                    return 'Project name already exists. Please choose a different name.'
                } else {
                    return undefined
                }
            },
        ]
    }, [projects])

    const handleConfirmProjectForAdd = useCallback(async () => {
        const project = newProject(projectForAddModalValue.trim(), undefined)

        await putProject(db, project)

        // reloadProjects()
        //
        // setProjectForAddModalValue('')
        //
        // setIsProjectForAddModalVisible(false)

        navigate(`app/${project._id}`, {
            replace: true,
        })
    }, [
        projectForAddModalValue,
        // reloadProjects
    ])

    const handleConfirmProjectForRename = useCallback(async () => {
        if (selectedProjectForRename) {
            await setDocumentName<Project>(
                db,
                selectedProjectForRename._id,
                projectForRenameModalValue.trim(),
            )

            reloadProjects()

            setProjectForRenameModalValue('')

            setSelectedProjectForRename(undefined)
        }
    }, [projectForRenameModalValue, reloadProjects, selectedProjectForRename])

    return (
        <>
            <StringInputModal
                title="Enter new project name"
                cancelLabel="Cancel"
                confirmLabel="Add"
                value={projectForAddModalValue}
                validators={projectNameValidators}
                show={isProjectForAddModalVisible}
                onHide={() => {
                    setIsProjectForAddModalVisible(false)

                    setProjectForAddModalValue('')
                }}
                onCancel={() => {
                    setIsProjectForAddModalVisible(false)

                    setProjectForAddModalValue('')
                }}
                onConfirm={handleConfirmProjectForAdd}
                onChange={value => {
                    setProjectForAddModalValue(value)
                }}
            />
            <StringInputModal
                title="Enter new project name"
                cancelLabel="Cancel"
                confirmLabel="Rename"
                value={projectForRenameModalValue}
                validators={projectNameValidators}
                show={selectedProjectForRename !== undefined}
                onHide={() => {
                    setSelectedProjectForRename(undefined)

                    setProjectForRenameModalValue('')
                }}
                onCancel={() => {
                    setSelectedProjectForRename(undefined)

                    setProjectForRenameModalValue('')
                }}
                onConfirm={handleConfirmProjectForRename}
                onChange={value => {
                    setProjectForRenameModalValue(value)
                }}
            />
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
                            For your records
                            <br />
                            For your clients
                            <br />
                            For quality assurance reporting
                        </p>
                        <br />
                        <div className="button-container-center">
                            <Button
                                onClick={() => {
                                    setIsProjectForAddModalVisible(true)
                                }}
                            >
                                Add a New Project
                            </Button>
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
                        <Button
                            onClick={() => {
                                setIsProjectForAddModalVisible(true)
                            }}
                        >
                            Add a New Project
                        </Button>
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
                                onDelete={() =>
                                    setSelectedProjectForDelete(project)
                                }
                                onSelect={() => {
                                    setSelectedProjectForRename(project)

                                    setProjectForRenameModalValue(
                                        project.metadata_.doc_name,
                                    )
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
