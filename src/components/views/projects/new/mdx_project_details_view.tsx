import PouchDB from 'pouchdb'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import DocNameInputWrapper from '../../shared/doc_name_input_wrapper'
import MdxWrapper from '../../../mdx_wrapper'
import { useDatabase } from '../../../../providers/database_provider'
import StoreProvider from '../../../../providers/store_provider'
import DOEProjectDetailsTemplate from '../../../../templates/doe_project_details.mdx'
import { type Project } from '../../../../types/database.types'
import { type Installer } from '../../../../types/installer.type'
import {
    getLastModifiedInstaller,
    newProject,
    putProject,
} from '../../../../utilities/database_utils'
import { hasErrors } from '../../../../utilities/validation_utils'

type MdxProjectViewProps = Record<string, never>

const MdxProjectView: React.FC<MdxProjectViewProps> = () => {
    const db = useDatabase()
    const navigate = useNavigate()
    const [project, setProject] = useState<PouchDB.Core.PutDocument<Project>>()

    useEffect(() => {
        const fetchAndInitializeProject = async () => {
            try {
                let installerDefaults: Installer = {
                    name: '',
                    company_name: '',
                    mailing_address: '',
                    phone: '',
                    email: '',
                }

                const mostRecentInstaller = await getLastModifiedInstaller(
                    db as PouchDB.Database<Project>,
                )
                if (mostRecentInstaller) {
                    installerDefaults = mostRecentInstaller
                }

                const newProjectData = newProject('', undefined, {
                    installer: installerDefaults,
                })

                setProject({
                    ...newProjectData,
                    metadata_: {
                        ...newProjectData.metadata_,
                        errors: {
                            data_: {},
                            metadata_: {
                                doc_name: [''],
                            },
                        },
                    },
                })
            } catch (error) {
                console.error('Error fetching projects:', error)
            }
        }

        fetchAndInitializeProject()
    }, [db])

    const isProjectValid = useMemo(() => {
        if (!project) {
            return false
        }

        const projectWithMeta = project as PouchDB.Core.Document<Project> &
            PouchDB.Core.GetMeta
        return !hasErrors(projectWithMeta)
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

            if (project) {
                await putProject(db, project)
                navigate(`/app/${project._id}/workflows`)
            }

            return false
        },
        [db, navigate, project],
    )

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
}

export default MdxProjectView
