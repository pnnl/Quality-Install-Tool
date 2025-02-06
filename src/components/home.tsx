import PouchDB from 'pouchdb'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import DeleteConfirmationModal from './delete_confirmation_modal'
import ImportDoc from './import_document'
import NewProjectButton from './new_project_button'
import ProjectListGroup from './project_list_group'
import { type Base, type Project } from '../types/database.types'
import {
    getProjects,
    putNewProject,
    removeEmptyProjects,
    removeProject,
    useDB,
} from '../utilities/database_utils'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
    const db: PouchDB.Database<Base> = useDB()

    const navigate = useNavigate()

    const [projectDocs, setProjectDocs] = useState<
        Array<PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta>
    >([])
    const [selectedProjectDoc, setSelectedProjectDoc] = useState<
        | (PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta)
        | undefined
    >(undefined)

    useEffect((): void => {
        removeEmptyProjects(db).then(async (): Promise<void> => {
            const projectDocs: Array<
                PouchDB.Core.ExistingDocument<Project> &
                    PouchDB.Core.AllDocsMeta
            > = await getProjects(db)

            setProjectDocs(
                projectDocs.sort((a, b): number => {
                    const aDate: Date = new Date(a.metadata_.last_modified_at)
                    const bDate: Date = new Date(b.metadata_.last_modified_at)

                    // Descending order.
                    return bDate.getTime() - aDate.getTime()
                }),
            )
        })
    }, [])

    return (
        <>
            <div>
                {projectDocs.length === 0 ? (
                    <center>
                        <br />
                        <p className="welcome-header">
                            Welcome to the Quality Install Tool
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
                                onClick={async () => {
                                    const projectDoc: PouchDB.Core.Document<Project> &
                                        PouchDB.Core.GetMeta =
                                        await putNewProject(db, '', undefined)

                                    navigate(`app/${projectDoc._id}`, {
                                        replace: true,
                                    })
                                }}
                            />
                            &nbsp;&nbsp;
                            <ImportDoc label="Import a Project" />
                        </div>
                    </center>
                ) : (
                    <div>
                        <div className="align-right padding">
                            <NewProjectButton
                                label="Add a New Project"
                                onClick={async () => {
                                    const projectDoc: PouchDB.Core.Document<Project> &
                                        PouchDB.Core.GetMeta =
                                        await putNewProject(db, '', undefined)

                                    navigate(`app/${projectDoc._id}`, {
                                        replace: true,
                                    })
                                }}
                            />
                            &nbsp;&nbsp;
                            <ImportDoc label="Import Project" />
                        </div>
                        <div>
                            {projectDocs.map(projectDoc => (
                                <ProjectListGroup
                                    projectDoc={projectDoc}
                                    onEdit={() =>
                                        navigate(`app/${projectDoc._id}`, {
                                            replace: true,
                                        })
                                    }
                                    onDelete={() =>
                                        setSelectedProjectDoc(projectDoc)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <br />
            <center>
                <p className="welcome-content">
                    <br />
                    Click here to learn more about the{' '}
                    <a
                        href="https://www.pnnl.gov/projects/quality-install-tool"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Quality Install Tool
                    </a>
                </p>
            </center>
            {selectedProjectDoc && (
                <DeleteConfirmationModal
                    label={selectedProjectDoc.metadata_.doc_name}
                    show={selectedProjectDoc !== undefined}
                    onHide={() => setSelectedProjectDoc(undefined)}
                    onCancel={() => setSelectedProjectDoc(undefined)}
                    onConfirm={async () => {
                        const [response] = await removeProject(
                            db,
                            selectedProjectDoc._id,
                        )

                        if (response.ok) {
                            setProjectDocs(previousProjectDocs => {
                                return previousProjectDocs.filter(
                                    previousProjectDoc => {
                                        return (
                                            previousProjectDoc._id !==
                                            selectedProjectDoc._id
                                        )
                                    },
                                )
                            })
                        }

                        setSelectedProjectDoc(undefined)
                    }}
                />
            )}
        </>
    )
}

export default Home
