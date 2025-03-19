import PouchDB from 'pouchdb'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import DocNameInputWrapper from '../../shared/doc_name_input_wrapper'
import MdxWrapper from '../../../mdx_wrapper'
import { useDatabase } from '../../../../providers/database_provider'
import StoreProvider from '../../../../providers/store_provider'
import DOEProjectDetailsTemplate from '../../../../templates/doe_project_details.mdx'
import { type Project } from '../../../../types/database.types'
import { newProject, putProject } from '../../../../utilities/database_utils'
import { hasErrors } from '../../../../utilities/validation_utils'
import { isProject } from '../../../../types/database.types'

type MdxProjectViewProps = Record<string, never>

const MdxProjectView: React.FC<MdxProjectViewProps> = () => {
    const db = useDatabase()

    const navigate = useNavigate()

    const [project, setProject] = useState<PouchDB.Core.PutDocument<Project>>(
        () => {
            const project = newProject('')

            return {
                ...project,
                metadata_: {
                    ...project.metadata_,
                    errors: {
                        data_: {},
                        metadata_: {
                            doc_name: [''],
                        },
                    },
                },
            }
        },
    )
    const [installerData, setInstallerData] = useState<
        Project['data_']['installer'] | null
    >(null)

    const isProjectValid = useMemo<boolean>(() => {
        return !hasErrors(
            project as PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta,
        )
    }, [project])

    const handleClickCancel = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            navigate('/')

            return false
        },
        [navigate],
    )

    const handleClickSaveProject = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            await putProject(db, project)

            navigate(`/app/${project._id}/workflows`)

            return false
        },
        [db, navigate, project],
    )

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const allDocs = await db.allDocs({ include_docs: true })

                // Filter projects that have installer data and type 'project'
                const projects = allDocs.rows
                    .filter(row => isProject(row.doc))
                    .map(row => row.doc as Project)

                if (projects.length > 0) {
                    // Find the most recently modified project
                    const mostRecentProject = projects.reduce(
                        (latest, current) =>
                            new Date(current.metadata_.last_modified_at) >
                            new Date(latest.metadata_.last_modified_at)
                                ? current
                                : latest,
                    )
                    setInstallerData(mostRecentProject.data_.installer)
                }
            } catch (error) {
                console.error('Error fetching documents from PouchDB:', error)
            }
        }

        fetchProjects()
    }, [db])

    return (
        <>
            <h1>New Project</h1>
            <br />
            <StoreProvider
                doc={
                    project as PouchDB.Core.Document<Project> &
                        PouchDB.Core.GetMeta
                }
                onChange={doc =>
                    setProject(
                        doc as PouchDB.Core.Document<Project> &
                            PouchDB.Core.GetMeta,
                    )
                }
            >
                <div className="container">
                    <DocNameInputWrapper currentValue={''} />
                </div>
                <MdxWrapper
                    Component={DOEProjectDetailsTemplate}
                    project={
                        project as PouchDB.Core.Document<Project> &
                            PouchDB.Core.GetMeta
                    }
                    installerData={installerData}
                />
            </StoreProvider>
            <center>
                <Button variant="secondary" onClick={handleClickCancel}>
                    Cancel
                </Button>
                &nbsp;&nbsp;
                <Button
                    variant="primary"
                    disabled={!isProjectValid}
                    onClick={handleClickSaveProject}
                >
                    Create Project
                </Button>
            </center>
        </>
    )

    return null
}

export default MdxProjectView
