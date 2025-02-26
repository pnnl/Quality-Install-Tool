import React, { useCallback, useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import InstallationListGroup from './installation_list_group'
import DeleteConfirmationModal from '../../shared/delete_confirmation_modal'
import StringInputModal from '../../shared/string_input_modal'
import LocationStr from '../../../location_str'
import { useDatabase } from '../../../../providers/database_provider'
import {
    type InstallationDocument,
    useInstallations,
} from '../../../../providers/installations_provider'
import { useProject } from '../../../../providers/project_provider'
import { useWorkflow } from '../../../../providers/workflow_provider'
import templates from '../../../../templates'
import { type Installation } from '../../../../types/database.types'
import {
    newInstallation,
    putInstallation,
    removeInstallation,
    setDocumentName,
} from '../../../../utilities/database_utils'
import { someLocation } from '../../../../utilities/location_utils'
import { type Validator } from '../../../../utilities/validation_utils'

interface JobListProps {
    workflowName: string | undefined
}

const JobList: React.FC<JobListProps> = ({ workflowName }) => {
    const db = useDatabase()

    const navigate = useNavigate()

    const [project, , reloadProject] = useProject()

    const workflow = useWorkflow()

    const [installations, setInstallations, reloadInstallations] =
        useInstallations()

    const [installationForAddModalValue, setInstallationForAddModalValue] =
        useState<string>('')
    const [
        installationForRenameModalValue,
        setInstallationForRenameModalValue,
    ] = useState<string>('')
    const [
        isInstallationForAddModalVisible,
        setIsInstallationForAddModalVisible,
    ] = useState<boolean>(false)
    const [selectedInstallationForDelete, setSelectedInstallationForDelete] =
        useState<InstallationDocument | undefined>(undefined)
    const [selectedInstallationForRename, setSelectedInstallationForRename] =
        useState<InstallationDocument | undefined>(undefined)

    const installationNameValidators = useMemo<Array<Validator<string>>>(() => {
        const re = /^(?![\s-])[a-z0-9, -]{1,64}$/i

        const installationDocumentNames = installations.map(installation => {
            return installation.metadata_.doc_name
        })

        return [
            input => {
                if (re.test(input)) {
                    return undefined
                } else {
                    return 'The installation name must be no more than 64 characters consisting of letters, numbers, dashes, and single spaces. Single spaces can only appear between other characters.'
                }
            },
            input => {
                if (installationDocumentNames.includes(input.trim())) {
                    return 'Installation name already exists. Please choose a different name.'
                } else {
                    return undefined
                }
            },
        ]
    }, [installations])

    // @note Implementation of {handleConfirmInstallationForAdd} function.
    //     After the PouchDB document for the new installation has been inserted
    //     into the database, there are 2 possible behaviors: reload the current
    //     list of installations, or navigate to the new installation. Both
    //     behaviors are implemented. Currently, the code for the first behavior
    //     is commented out.
    //
    //     To revert to the first behavior, uncomment the lines for the 4
    //     function calls and the dependencies on the {reloadProject} and
    //     {reloadInstallations} functions in the call to {React.useCallback}
    //     function, and then comment out the call to the {navigate} function.
    const handleConfirmInstallationForAdd = useCallback(async () => {
        if (project && workflowName) {
            const installation = newInstallation(
                installationForAddModalValue.trim(),
                workflowName,
                templates[workflowName]?.title || '',
                undefined,
            )

            await putInstallation(db, project._id, installation)

            // await reloadInstallations()
            //
            // await reloadProject()
            //
            // setIsInstallationForAddModalVisible(false)
            //
            // setInstallationForAddModalValue('')

            navigate(
                `/app/${project._id}/${workflowName}/${installation._id}`,
                {
                    replace: true,
                },
            )
        }
    }, [
        db,
        installationForAddModalValue,
        navigate,
        project,
        // reloadInstallations,
        // reloadProject,
        workflowName,
    ])

    const handleConfirmInstallationForDelete = useCallback(async () => {
        if (project && selectedInstallationForDelete) {
            await removeInstallation(
                db,
                project._id,
                selectedInstallationForDelete._id,
                selectedInstallationForDelete._rev,
            )

            setInstallations(previousInstallations => {
                return previousInstallations.filter(previousInstallation => {
                    return (
                        previousInstallation._id !==
                        selectedInstallationForDelete._id
                    )
                })
            })

            await reloadProject()

            setSelectedInstallationForDelete(undefined)
        }
    }, [
        db,
        project,
        reloadProject,
        selectedInstallationForDelete,
        setInstallations,
    ])

    const handleConfirmInstallationForRename = useCallback(async () => {
        if (selectedInstallationForRename) {
            await setDocumentName<Installation>(
                db,
                selectedInstallationForRename._id,
                installationForRenameModalValue.trim(),
            )

            await reloadInstallations()

            setSelectedInstallationForRename(undefined)

            setInstallationForRenameModalValue('')
        }
    }, [
        db,
        installationForRenameModalValue,
        reloadInstallations,
        selectedInstallationForRename,
    ])

    return (
        <>
            <StringInputModal
                title="Enter new installation name"
                cancelLabel="Cancel"
                confirmLabel="Add"
                value={installationForAddModalValue}
                validators={installationNameValidators}
                show={isInstallationForAddModalVisible}
                onHide={() => {
                    setIsInstallationForAddModalVisible(false)

                    setInstallationForAddModalValue('')
                }}
                onCancel={() => {
                    setIsInstallationForAddModalVisible(false)

                    setInstallationForAddModalValue('')
                }}
                onConfirm={handleConfirmInstallationForAdd}
                onChange={value => {
                    setInstallationForAddModalValue(value)
                }}
            />
            <StringInputModal
                title="Enter new installation name"
                cancelLabel="Cancel"
                confirmLabel="Rename"
                value={installationForRenameModalValue}
                validators={installationNameValidators}
                show={selectedInstallationForRename !== undefined}
                onHide={() => {
                    setSelectedInstallationForRename(undefined)

                    setInstallationForRenameModalValue('')
                }}
                onCancel={() => {
                    setSelectedInstallationForRename(undefined)

                    setInstallationForRenameModalValue('')
                }}
                onConfirm={handleConfirmInstallationForRename}
                onChange={value => {
                    setInstallationForRenameModalValue(value)
                }}
            />
            <DeleteConfirmationModal
                label={selectedInstallationForDelete?.metadata_.doc_name ?? ''}
                show={selectedInstallationForDelete !== undefined}
                onHide={() => {
                    setSelectedInstallationForDelete(undefined)
                }}
                onCancel={() => {
                    setSelectedInstallationForDelete(undefined)
                }}
                onConfirm={handleConfirmInstallationForDelete}
            />
            {project && workflow && (
                <div className="container">
                    <h1>{workflow.title}</h1>
                    <h2>Installations for {project.metadata_.doc_name}</h2>
                    {project.data_.location &&
                        someLocation(project.data_.location) && (
                            <p className="address">
                                <LocationStr
                                    location={project.data_.location}
                                    separators={[', ', ', ', ' ']}
                                />
                            </p>
                        )}
                    <br />
                    <Button
                        variant="primary"
                        onClick={() => {
                            setIsInstallationForAddModalVisible(true)
                        }}
                    >
                        Add Installation
                    </Button>
                    {installations.length > 0 && (
                        <>
                            <div className="bottom-margin"></div>
                            <div>
                                {installations.map(installation => (
                                    <InstallationListGroup
                                        key={installation._id}
                                        to={`/app/${project._id}/${installation.metadata_.template_name}/${installation._id}`}
                                        onEdit={() => {
                                            setSelectedInstallationForRename(
                                                installation,
                                            )

                                            setInstallationForRenameModalValue(
                                                installation.metadata_.doc_name,
                                            )
                                        }}
                                        onDelete={() => {
                                            setSelectedInstallationForDelete(
                                                installation,
                                            )
                                        }}
                                    >
                                        {installation.metadata_.doc_name}
                                    </InstallationListGroup>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default JobList
