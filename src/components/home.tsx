import PouchDB from 'pouchdb'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import DeleteConfirmationModal from './delete_confirmation_modal'
import ImportDoc from './import_document'
import NewProjectButton from './new_project_button'
import ProjectListGroup from './project_list_group'
import { useDatabase } from '../providers/database_provider'
import { type Base, type Project } from '../types/database.types'
import { type Comparator, comparator } from '../utilities/comparison_utils'
import {
    getProject,
    getProjects,
    putNewProject,
    removeEmptyProjects,
    removeProject,
} from '../utilities/database_utils'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
    const db: PouchDB.Database<Base> = useDatabase()

    const navigate = useNavigate()

    const [projectDocs, setProjectDocs] = useState<
        Array<PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta>
    >([])
    const [selectedProjectDoc, setSelectedProjectDoc] = useState<
        | (PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta)
        | undefined
    >(undefined)

    const projectComparator: Comparator<Project> = useMemo<
        Comparator<Project>
    >(() => {
        return comparator<Project>('last_modified_at', 'desc')
    }, [])

    const reloadProjectDocs = useCallback(async () => {
        await removeEmptyProjects(db)

        const projectDocs: Array<
            PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta
        > = await getProjects(db)

        setProjectDocs(projectDocs.sort(projectComparator))
    }, [projectComparator])

    useEffect(() => {
        reloadProjectDocs()

        return () => {
            setProjectDocs([])
            setSelectedProjectDoc(undefined)
        }
    }, [reloadProjectDocs])

    return (
        <>
            {projectDocs.length === 0 ? (
                <div>
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
                            <ImportDoc
                                label="Import a Project"
                                onImport={async (
                                    projectId: PouchDB.Core.DocumentId,
                                ) => {
                                    const projectDoc: PouchDB.Core.Document<Project> &
                                        PouchDB.Core.GetMeta = await getProject(
                                        db,
                                        projectId,
                                    )

                                    // reloadProjectDocs()
                                    setProjectDocs(previousProjectDocs => {
                                        return [
                                            projectDoc,
                                            ...previousProjectDocs,
                                        ]
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
                            onClick={async () => {
                                const projectDoc: PouchDB.Core.Document<Project> &
                                    PouchDB.Core.GetMeta = await putNewProject(
                                    db,
                                    '',
                                    undefined,
                                )

                                navigate(`app/${projectDoc._id}`, {
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
                                const projectDoc: PouchDB.Core.Document<Project> &
                                    PouchDB.Core.GetMeta = await getProject(
                                    db,
                                    projectId,
                                )

                                // reloadProjectDocs()
                                setProjectDocs(previousProjectDocs => {
                                    return [projectDoc, ...previousProjectDocs]
                                })
                            }}
                        />
                    </div>
                    <div>
                        {projectDocs.map(
                            (
                                projectDoc: PouchDB.Core.ExistingDocument<Project> &
                                    PouchDB.Core.AllDocsMeta,
                            ) => (
                                <ProjectListGroup
                                    key={projectDoc._id}
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
                            ),
                        )}
                    </div>
                </div>
            )}
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
            <DeleteConfirmationModal
                label={selectedProjectDoc?.metadata_?.doc_name ?? ''}
                show={selectedProjectDoc !== undefined}
                onHide={() => setSelectedProjectDoc(undefined)}
                onCancel={() => setSelectedProjectDoc(undefined)}
                onConfirm={async () => {
                    if (selectedProjectDoc) {
                        const [projectResponse, installationResponses]: [
                            PouchDB.Core.Response,
                            Array<PouchDB.Core.Response | PouchDB.Core.Error>,
                        ] = await removeProject(db, selectedProjectDoc._id)

                        if (
                            projectResponse.ok &&
                            installationResponses.every(
                                installationResponse => {
                                    return
                                    'ok' in installationResponse &&
                                        (
                                            installationResponse as PouchDB.Core.Response
                                        ).ok
                                },
                            )
                        ) {
                            // reloadProjectDocs()
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
                    }
                }}
            />
        </>
    )
}

export default Home
