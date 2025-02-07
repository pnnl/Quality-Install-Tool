import PouchDB from 'pouchdb'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useParams } from 'react-router-dom'

import DeleteConfirmationModal from './delete_confirmation_modal'
import InstallationListGroup from './installation_list_group'
import LocationStr from './location_str'
import StringInputModal from './string_input_modal'
import { useDatabase } from '../providers/database_provider'
import templatesConfig from '../templates/templates_config'
import {
    type Base,
    type Installation,
    type Project,
} from '../types/database.types'
import { type Comparator, comparator } from '../utilities/comparison_utils'
import {
    getProject,
    getInstallations,
    putNewInstallation,
    removeInstallation,
    renameDoc,
} from '../utilities/database_utils'
import { someLocation } from '../utilities/location_utils'
import { type Validator } from '../utilities/validation_utils'

interface JobListProps {}

const JobList: React.FC<JobListProps> = () => {
    const db: PouchDB.Database<Base> = useDatabase()

    const { projectId, workflowName } = useParams()

    const [installationDocs, setInstallationDocs] = useState<
        Array<
            PouchDB.Core.ExistingDocument<Installation> &
                PouchDB.Core.AllDocsMeta
        >
    >([])
    const [
        installationDocForAddModalValue,
        setInstallationDocForAddModalValue,
    ] = useState<string>('')
    const [
        installationDocForRenameModalValue,
        setInstallationDocForRenameModalValue,
    ] = useState<string>('')
    const [
        isInstallationDocForAddModalVisible,
        setIsInstallationDocForAddModalVisible,
    ] = useState<boolean>(false)
    const [projectDoc, setProjectDoc] = useState<
        (PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta) | undefined
    >(undefined)
    const [
        selectedInstallationDocForDelete,
        setSelectedInstallationDocForDelete,
    ] = useState<
        | (PouchDB.Core.ExistingDocument<Installation> &
              PouchDB.Core.AllDocsMeta)
        | undefined
    >(undefined)
    const [
        selectedInstallationDocForRename,
        setSelectedInstallationDocForRename,
    ] = useState<
        | (PouchDB.Core.ExistingDocument<Installation> &
              PouchDB.Core.AllDocsMeta)
        | undefined
    >(undefined)

    const installationComparator: Comparator<Installation> = useMemo<
        Comparator<Installation>
    >(() => {
        return comparator<Installation>('last_modified_at', 'desc')
    }, [])

    const installationDocNameValidators = useMemo<
        Array<Validator<string>>
    >(() => {
        const re: RegExp = /^(?![\s-])[a-z0-9, -]{1,64}$/i

        const installationDocNames: string[] = installationDocs.map(
            installationDoc => {
                return installationDoc.metadata_.doc_name
            },
        )

        return [
            (input: string): string | undefined => {
                if (re.test(input)) {
                    return undefined
                } else {
                    return 'The job or task name must be no more than 64 characters consisting of letters, numbers, dashes, and single spaces. Single spaces can only appear between other characters.'
                }
            },
            (input: string): string | undefined => {
                if (installationDocNames.includes(input.trim())) {
                    return 'Job name already exists. Please choose a different name.'
                } else {
                    return undefined
                }
            },
        ]
    }, [installationDocs])

    const reloadProjectDoc = useCallback(async () => {
        const projectDoc: PouchDB.Core.Document<Project> &
            PouchDB.Core.GetMeta = await getProject(
            db,
            projectId as PouchDB.Core.DocumentId,
        )

        setProjectDoc(projectDoc)
    }, [projectId])

    useEffect(() => {
        reloadProjectDoc()

        return () => {
            setProjectDoc(undefined)
        }
    }, [reloadProjectDoc])

    const reloadInstallationDocs = useCallback(async () => {
        const installationDocs: Array<
            PouchDB.Core.ExistingDocument<Installation> &
                PouchDB.Core.AllDocsMeta
        > = await getInstallations(
            db,
            projectId as PouchDB.Core.DocumentId,
            workflowName as keyof typeof templatesConfig | undefined,
        )

        setInstallationDocs(installationDocs.sort(installationComparator))
    }, [installationComparator, projectId, workflowName])

    useEffect(() => {
        reloadInstallationDocs()

        return () => {
            setInstallationDocs([])
            setSelectedInstallationDocForDelete(undefined)
            setSelectedInstallationDocForRename(undefined)
        }
    }, [reloadInstallationDocs])

    const handleConfirmInstallationDocForAdd = useCallback(async () => {
        const installationDoc: PouchDB.Core.Document<Installation> &
            PouchDB.Core.GetMeta = await putNewInstallation(
            db,
            projectId as PouchDB.Core.DocumentId,
            workflowName as keyof typeof templatesConfig,
            installationDocForAddModalValue,
            undefined,
        )

        // reloadInstallationDocs()
        setInstallationDocs(previousInstallationDocs => {
            return [installationDoc, ...previousInstallationDocs]
        })

        reloadProjectDoc()

        setIsInstallationDocForAddModalVisible(false)

        setInstallationDocForAddModalValue('')
    }, [
        installationDocForAddModalValue,
        reloadProjectDoc,
        projectId,
        workflowName,
    ])

    const handleConfirmInstallationDocForDelete = useCallback(async () => {
        if (selectedInstallationDocForDelete) {
            const [installationResponse, projectUpsertResponse]: [
                PouchDB.Core.Response | undefined,
                PouchDB.UpsertResponse,
            ] = await removeInstallation(
                db,
                projectId as PouchDB.Core.DocumentId,
                selectedInstallationDocForDelete._id,
                selectedInstallationDocForDelete._rev,
            )

            if (
                installationResponse &&
                installationResponse.ok &&
                projectUpsertResponse.updated
            ) {
                // reloadInstallationDocs()
                setInstallationDocs(previousInstallationDocs => {
                    return previousInstallationDocs.filter(
                        previousInstallationDoc => {
                            return (
                                previousInstallationDoc._id !==
                                selectedInstallationDocForDelete._id
                            )
                        },
                    )
                })

                reloadProjectDoc()

                setSelectedInstallationDocForDelete(undefined)
            } else {
                throw new Error(
                    'handleConfirmInstallationDocForDelete: Upsert failed.',
                )
            }
        }
    }, [
        reloadInstallationDocs,
        reloadProjectDoc,
        projectId,
        selectedInstallationDocForDelete,
    ])

    const handleConfirmInstallationDocForRename = useCallback(async () => {
        if (selectedInstallationDocForRename) {
            const upsertResponse: PouchDB.UpsertResponse =
                await renameDoc<Installation>(
                    db,
                    selectedInstallationDocForRename._id,
                    installationDocForRenameModalValue,
                )

            if (upsertResponse.updated) {
                reloadInstallationDocs()
            } else {
                throw new Error(
                    'handleConfirmInstallationDocForRename: Upsert failed.',
                )
            }

            setSelectedInstallationDocForRename(undefined)

            setInstallationDocForRenameModalValue('')
        }
    }, [
        installationDocForRenameModalValue,
        reloadInstallationDocs,
        selectedInstallationDocForRename,
    ])

    return (
        <>
            <div className="container">
                <h1>
                    {
                        templatesConfig[
                            workflowName as keyof typeof templatesConfig
                        ].title
                    }
                </h1>
                <h2>
                    Installations
                    {projectDoc?.metadata_.doc_name && (
                        <> for {projectDoc.metadata_.doc_name}</>
                    )}
                </h2>
                {projectDoc?.data_.location &&
                    someLocation(projectDoc.data_.location) && (
                        <p className="address">
                            <LocationStr
                                location={projectDoc.data_.location}
                                separators={[', ', ', ', ' ']}
                            />
                        </p>
                    )}
                <br />
                <Button
                    variant="primary"
                    onClick={() => {
                        setIsInstallationDocForAddModalVisible(true)
                    }}
                >
                    Add Installation
                </Button>
                {installationDocs.length > 0 && (
                    <>
                        <div className="bottom-margin"></div>
                        <div>
                            {installationDocs.map(
                                (
                                    installationDoc: PouchDB.Core.ExistingDocument<Installation> &
                                        PouchDB.Core.AllDocsMeta,
                                ) => (
                                    <InstallationListGroup
                                        key={installationDoc._id}
                                        projectId={
                                            projectId as PouchDB.Core.DocumentId
                                        }
                                        workflowName={
                                            workflowName as keyof typeof templatesConfig
                                        }
                                        installationDoc={installationDoc}
                                        onEdit={() => {
                                            setSelectedInstallationDocForRename(
                                                installationDoc,
                                            )

                                            setInstallationDocForRenameModalValue(
                                                installationDoc.metadata_
                                                    .doc_name,
                                            )
                                        }}
                                        onDelete={() => {
                                            setSelectedInstallationDocForDelete(
                                                installationDoc,
                                            )
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    </>
                )}
            </div>
            <StringInputModal
                title="Enter new installation name"
                cancelLabel="Cancel"
                confirmLabel="Add"
                value={installationDocForAddModalValue}
                validators={installationDocNameValidators}
                show={isInstallationDocForAddModalVisible}
                onHide={() => {
                    setIsInstallationDocForAddModalVisible(false)

                    setInstallationDocForAddModalValue('')
                }}
                onCancel={() => {
                    setIsInstallationDocForAddModalVisible(false)

                    setInstallationDocForAddModalValue('')
                }}
                onConfirm={handleConfirmInstallationDocForAdd}
                onChange={(value: string) => {
                    setInstallationDocForAddModalValue(value)
                }}
            />
            <StringInputModal
                title="Enter new installation name"
                cancelLabel="Cancel"
                confirmLabel="Rename"
                value={installationDocForRenameModalValue}
                validators={installationDocNameValidators}
                show={selectedInstallationDocForRename !== undefined}
                onHide={() => {
                    setSelectedInstallationDocForRename(undefined)

                    setInstallationDocForRenameModalValue('')
                }}
                onCancel={() => {
                    setSelectedInstallationDocForRename(undefined)

                    setInstallationDocForRenameModalValue('')
                }}
                onConfirm={handleConfirmInstallationDocForRename}
                onChange={(value: string) => {
                    setInstallationDocForRenameModalValue(value)
                }}
            />
            <DeleteConfirmationModal
                label={
                    selectedInstallationDocForDelete?.metadata_.doc_name ?? ''
                }
                show={selectedInstallationDocForDelete !== undefined}
                onHide={() => {
                    setSelectedInstallationDocForDelete(undefined)
                }}
                onCancel={() => {
                    setSelectedInstallationDocForDelete(undefined)
                }}
                onConfirm={handleConfirmInstallationDocForDelete}
            />
        </>
    )
}

export default JobList
