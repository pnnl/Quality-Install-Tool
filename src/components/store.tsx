import PouchDB from 'pouchdb'
import PouchDBUpsert from 'pouchdb-upsert'
import React, {
    type FC,
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'

import { isEmpty, isObject, toPath } from 'lodash'
import type JSONValue from '../types/json_value.type'
import { getMetadataFromPhoto, isPhoto } from '../utilities/photo_utils'
import type Attachment from '../types/attachment.type'
import type { NonEmptyArray } from '../types/misc_types.type'
import type Metadata from '../types/metadata.type'
import {
    putNewProject,
    putNewInstallation,
    useDB,
} from '../utilities/database_utils'
import EventEmitter from 'events'
import { getAuthToken } from '../auth/keycloak'
import jsPDF from 'jspdf'

PouchDB.plugin(PouchDBUpsert)

type UpsertAttachment = (
    blob: Blob,
    id: string,
    fileName?: string,
    photoMetadata?: Attachment['metadata'],
) => void

type UpsertData = (pathStr: string, value: any) => void

type UpsertMetadata = (pathStr: string, value: any) => void

type UpsertDoc = (pathStr: string, data: any) => void

type Attachments = Record<
    string,
    | Attachment
    | { blob: Blob; digest: string; metadata: Record<string, JSONValue> }
>

declare global {
    interface Window {
        docData: any
    }
}

export const StoreContext = React.createContext({
    docId: '' satisfies string,
    attachments: {} satisfies Attachments,
    data: {} satisfies JSONValue,
    metadata: {} satisfies Metadata | Record<string, string>,
    upsertAttachment: ((
        blob: Blob,
        id: any,
        fileName?,
    ) => {}) as UpsertAttachment,
    deleteAttachment: (attachmentId: string) => {},
    upsertData: ((pathStr: string, data: any) => {}) as UpsertData,
    upsertMetadata: ((pathStr: string, data: any) => {}) as UpsertMetadata,
})

interface StoreProviderProps {
    children: ReactNode
    dbName: string | undefined
    docId: string
    workflowName: string
    docName: string
    type: string
    parentId?: string | undefined
}

/**
 * A wrapper component that connects its children to a data store via React Context
 *
 * @param children - The content wrapped by this component
 * @param dbName - Database name associated with an MDX template
 * @param docId - Document instance id
 */
export const StoreProvider: FC<StoreProviderProps> = ({
    children,
    dbName,
    docId,
    workflowName,
    docName,
    type,
    parentId,
}) => {
    const changesRef = useRef<PouchDB.Core.Changes<{}>>()
    const revisionRef = useRef<string>()
    // The attachments state will have the form: {[att_id]: {blob, digest, metadata}, ...}
    const [attachments, setAttachments] = useState<Record<string, Attachment>>(
        {},
    )
    //This  uses the `useDB` custom hook to create a PouchDB database with the specified `dbName`
    const [db, setDB] = useState<PouchDB.Database>(useDB(dbName))
    // The doc state could be anything that is JSON-compatible
    const [doc, setDoc] = useState<any>({})

    // Determining the doc type for updating it accordingly
    const isInstallationDoc = type === 'installation'

    // Increase the maximum number of listeners for all EventEmitters
    EventEmitter.defaultMaxListeners = 20

    /**
     * Updates component state based on a database document change
     *
     * @param dbDoc The full object representation of the changed document from the database
     */
    async function processDBDocChange(db: PouchDB.Database, dbDoc: any) {
        revisionRef.current = dbDoc._rev

        // Set doc state
        const newDoc: Partial<typeof dbDoc> = { ...dbDoc }
        delete newDoc._attachments
        delete newDoc._id
        delete newDoc._rev

        setDoc(newDoc)

        // Update the attachments state as needed
        // Note: dbDoc will not have a _attachments field if the document has no attachments
        if (db && dbDoc.hasOwnProperty('_attachments') && dbDoc._id == docId) {
            // Collect all the new or modified attachments
            const dbDocAttachments = dbDoc._attachments
            const attachmentsMetadata = dbDoc.metadata_.attachments
            let newAttachments: Record<string, Attachment> = {}
            for (const attachmentId in dbDocAttachments) {
                const docAttachment = dbDocAttachments[attachmentId]

                const attachmentIdParts = attachmentId.split('.')

                const singleAttachmentMetadata =
                    attachmentIdParts.length === 3
                        ? attachmentsMetadata[attachmentIdParts[0]]?.[
                              attachmentIdParts[1]
                          ]?.[attachmentIdParts[2]]
                        : attachmentsMetadata[attachmentId]

                // digest is a hash of the attachment, so a different digest indicates a modified attachment
                const digest = docAttachment?.digest
                if (
                    digest != null &&
                    (!attachments.hasOwnProperty(attachmentId) ||
                        attachments[attachmentId].digest !== digest)
                ) {
                    const blobOrBuffer = await db.getAttachment(
                        docId,
                        attachmentId,
                    )

                    if (blobOrBuffer instanceof Blob) {
                        const blob = blobOrBuffer
                        const metadata: Record<string, any> =
                            singleAttachmentMetadata as Record<string, any>

                        newAttachments = {
                            ...newAttachments,
                            [attachmentId]: {
                                blob,
                                digest,
                                metadata,
                            } satisfies Attachment,
                        }
                    } else {
                        throw new Error('Attachment must be a Blob')
                    }
                }
            }
            if (!isEmpty(newAttachments)) {
                // Update the attachments state
                // Note: We update all new attachments at once to avoid a race condition with state update
                setAttachments({ ...attachments, ...newAttachments })
            }
        }
    }

    useEffect(() => {
        const { processId, userId, processStepId } = extractLocalStorageData()
        if (!processStepId && processId) {
            console.log(`Fetching process_step_id for process: ${processId}`)

            fetch(`http://localhost:5000/api/process/${processId}/steps`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            })
                .then(response => response.json())
                .then(data => {
                    console.log('API Response for process steps:', data)

                    if (data.steps && data.steps.length > 0) {
                        const qualityInstallStep = data.steps.find(
                            (step: { description?: string }) =>
                                step.description &&
                                step.description.includes('quality install'),
                        )

                        if (qualityInstallStep) {
                            let processStepId = qualityInstallStep.id
                            localStorage.setItem(
                                'process_step_id',
                                processStepId,
                            )
                        }
                    } else {
                        console.warn('No steps found for process:', processId)
                    }
                })
                .catch(error =>
                    console.error('Error fetching process_step_id:', error),
                )
        }
        fetch(
            `http://localhost:5000/api/quality-install?user_id=${userId}&process_step_id=${processStepId}`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            },
        )
            .then(response => response.json())
            .then(data => {
                if (data.success && data.form) {
                    if (!doc.data_) doc.data_ = {}
                    doc.data_.form_id = data.form.id
                    localStorage.setItem('form_id', data.form.id)
                    window.docData = doc.data_
                } else {
                    createQualityInstallForm(userId, processStepId)
                }
            })
            .catch(error =>
                console.error('Error fetching quality install form:', error),
            )
    }, [])

    const createQualityInstallForm = (
        userId: string,
        processStepId: string,
    ) => {
        fetch(`http://localhost:5000/api/quality-install`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({
                user_id: userId,
                process_step_id: processStepId,
                form_data: {},
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('form_id', data.form_id)
                }
            })
            .catch(error =>
                console.error('Error in createQualityInstallForm:', error),
            )
    }

    useEffect(() => {
        /**
         * Connects the store to the database document
         *
         * @remarks
         * This is an IIFE (Immediately Invoked Function Expression) that
         * (1) Establishes a database connection
         * (2) Initializes the database document if it does not already exist
         * (3) Initializes the doc and attachments state from the database document
         * (4) Subscribes to future changes to the database document — it ignores changes that
         *     originated from this component
         */
        ;(async function connectStoreToDB() {
            try {
                // Initialize the DB document as needed
                const result = !isInstallationDoc
                    ? ((await putNewProject(db, docName, docId)) as unknown)
                    : ((await putNewInstallation(
                          db,
                          docId,
                          workflowName,
                          docName,
                          parentId as string,
                      )) as unknown)
                revisionRef.current = (result as PouchDB.Core.Response).rev
            } catch (err) {
                console.error('DB initialization error:', err)
                // TODO: Rethink how best to handle errors
            }
            // Initialize doc and attachments state from the DB document
            try {
                const dbDoc = await db.get(docId)
                processDBDocChange(db, dbDoc)
            } catch (err) {
                console.error('Unable to initialize state from DB:', err)
            }

            // Subscribe to DB document changes
            changesRef.current = db
                .changes({
                    include_docs: true,
                    live: true,
                    since: 'now',
                })
                .on('change', function (change) {
                    if (
                        change.doc != null &&
                        change.doc._rev !== revisionRef.current
                    ) {
                        // The change must have originated from outside this component, so update component state
                        processDBDocChange(db, change.doc)
                    }
                    // else: the change originated from this component, so ignore it
                })
                .on('error', function (err) {
                    // It's hard to imagine what would cause this since our DB is local
                    console.error('DB subscription connection failed')
                })

            // Cancel the DB subscription just before the component unmounts
            return () => {
                if (changesRef.current != null) {
                    changesRef.current.cancel()
                }
            }
        })()

        // Run this effect after the first render and whenever the dbName prop changes
    }, [dbName])

    /**
     * Updates (or inserts) data into the doc state and persists the new doc
     *
     * @remarks
     * The given path is guaranteed to exist after the update/insertion.
     * This function is called internally from upsertData and upsertAttachments function to update the doc with respective information.
     *
     * @param pathStr A string path such as "foo.bar[2].biz" that represents a path into the doc state
     * @param data The data that is to be updated/inserted at the path location in the doc state
     */
    const upsertDoc: UpsertDoc = (pathStr, data) => {
        // Update doc state

        const newDoc = immutableUpsert(
            doc,
            toPath(pathStr) as NonEmptyArray<string>,
            data,
        )
        setDoc(newDoc)

        // Persist the doc
        if (db != null) {
            db.upsert(docId, function upsertFn(dbDoc: any) {
                const result = { ...dbDoc, ...newDoc }
                if (!result.metadata_) {
                    result.metadata_ = {
                        created_at: new Date().toISOString(),
                        last_modified_at: new Date().toISOString(),
                    }
                } else {
                    result.metadata_.last_modified_at = new Date().toISOString()
                }
                return result
            })
                .then(function (res) {
                    revisionRef.current = res.rev
                })
                .catch(function (err: Error) {
                    console.error('upsert error:', err)
                })
        }
    }

    /**
     * Updates (or inserts) data into the data_ property of the doc state by invoking updatedDoc function
     *
     * @remarks
     * This function is typically passed to an input wrapper component via the StoreContext.Provider value
     * This function calls updateDoc, with the path to "data_" in dbDoc.
     *
     * @param pathStr A string path such as "foo.bar[2].biz" that represents a path into the doc state
     * @param value The value that is to be updated/inserted
     */

    const upsertData: UpsertData = (pathStr, value) => {
        pathStr = 'data_.' + pathStr
        upsertDoc(pathStr, value)
        window.docData = doc.data_
        autoSaveToRDS()
    }

    /**
     * Updates (or inserts) metadata into the metadata_ property of the doc state by invoking updatedDoc function
     *
     * @remarks
     * This function is typically passed to an input wrapper component via the StoreContext.Provider value
     * This function calls updateDoc, with the path to "data_" in dbDoc.
     *
     * @param pathStr A string path such as "foo.bar[2].biz" that represents a path into the doc state
     * @param value The value that is to be updated/inserted
     */
    const upsertMetadata: UpsertMetadata = (pathStr, value) => {
        pathStr = 'metadata_.' + pathStr
        upsertDoc(pathStr, value)
    }

    /**
     * Deletes an attachment (file/photo blob) and its associated metadata from a document in the database.
     *
     * This function removes the specified attachment by its ID, updates the document's metadata to reflect
     * the removal, and updates the local state to exclude the deleted attachment.
     *
     * @param {string} attachmentId - The ID of the attachment to delete.
     *
     * @throws {Error} Logs an error to the console if the deletion or update process fails.
     */
    const deleteAttachment = async (attachmentId: string) => {
        try {
            // Fetch the latest document revision
            const docDeleteAttachment: any = await db.get(docId)

            // Remove the attachment with the given attachmentId from the document
            await db.removeAttachment(
                docId,
                attachmentId,
                docDeleteAttachment._rev,
            )

            // Fetch the updated document to update its metadata
            const docRemovePhotoMetadata: any = await db.get(docId)
            const attachmentMetadata = doc.metadata_?.attachments || []

            // Filter out the deleted attachment from metadata
            const updatedAttachmentMetadata = Object.entries(attachmentMetadata)
                .filter(([key, value]) => key !== attachmentId)
                .reduce((acc: any, [key, value]) => {
                    acc[key] = value // Rebuild the object
                    return acc
                }, {})

            // Update the document's metadata with the filtered attachments
            docRemovePhotoMetadata.metadata_ = {
                ...docRemovePhotoMetadata.metadata_,
                attachments: updatedAttachmentMetadata,
            }

            // Update the document with the new metadata
            db.put(docRemovePhotoMetadata).then(function (res) {
                revisionRef.current = res.rev
            })

            // Update the local attachments state by removing the deleted attachment
            const updatedAttachments = Object.entries(attachments)
                .filter(([key, value]) => key !== attachmentId)
                .reduce((acc: any, [key, value]) => {
                    acc[key] = value // Rebuild the object
                    return acc
                }, {})

            setAttachments(updatedAttachments)
        } catch (error) {
            console.error('Error deleting attachment:', error)
        }
    }

    /**
     *
     * @param blob
     * @param id
     */
    const upsertAttachment: UpsertAttachment = async (
        blob: Blob,
        id: string,
        fileName?: string,
        photoMetadata?: Attachment['metadata'],
    ) => {
        const metadata: Attachment['metadata'] = photoMetadata
            ? photoMetadata
            : isPhoto(blob)
              ? await getMetadataFromPhoto(blob)
              : {
                    filename: fileName,
                    timestamp: new Date(Date.now()).toISOString(),
                }

        // Storing SingleAttachmentMetaData in the DB
        upsertMetadata('attachments.' + id, metadata)

        // Store the blob in memory
        const newAttachments = {
            ...attachments,
            [id]: {
                blob,
                metadata,
            },
        }

        setAttachments(newAttachments)

        // Persist the blob
        const upsertBlobDB = async (
            rev: string,
        ): Promise<PouchDB.Core.Response | null> => {
            let result = null
            if (db != null) {
                try {
                    result = await db.putAttachment(
                        docId,
                        id,
                        rev,
                        blob,
                        blob.type,
                    )
                } catch (err) {
                    // Try again with the latest rev value
                    const doc = await db.get(docId)
                    result = await upsertBlobDB(doc._rev)
                } finally {
                    if (result != null) {
                        revisionRef.current = result.rev
                    }
                }
            }
            return result
        }

        if (revisionRef.current) {
            upsertBlobDB(revisionRef.current)
        }
    }
    return (
        <StoreContext.Provider
            value={{
                attachments,
                docId: docId,
                data: doc.data_,
                metadata: doc.metadata_,
                upsertAttachment,
                deleteAttachment,
                upsertData,
                upsertMetadata,
            }}
        >
            {children}
        </StoreContext.Provider>
    )
}

/**
 * Immutably updates/inserts a target value at a given path
 * @param recipient
 * @param path
 * @param target
 * @returns A shallow copy of recipient that additionally has the value at path set to target
 */
export function immutableUpsert(
    recipient: any,
    path: NonEmptyArray<string>,
    target: any,
): any {
    const [propName, ...newPath] = path
    const newRecipient: any = isObject(recipient)
        ? Array.isArray(recipient)
            ? [...recipient]
            : ({ ...recipient } satisfies Record<string, any>)
        : isNaN(parseInt(propName))
          ? {}
          : []

    if (newPath.length === 0) {
        newRecipient[propName] = target
    } else {
        newRecipient[propName] = immutableUpsert(
            newRecipient[propName as keyof unknown],
            newPath as any,
            target,
        )
    }
    return newRecipient
}

export const saveProjectAndUploadToS3 = async (projectDoc: any) => {
    try {
        const pdf = new jsPDF()
        pdf.text(
            `Project: ${projectDoc.metadata_.doc_name || 'Untitled Project'}`,
            10,
            10,
        )
        pdf.text('Quality Install Tool Report', 10, 20)

        const reportData = {
            projectName: projectDoc.metadata_.doc_name,
            ...projectDoc.data_,
        }

        pdf.text(JSON.stringify(reportData, null, 2), 10, 30)
        const pdfBlob = pdf.output('blob')

        const s3Response = await fetch(
            'http://localhost:5000/api/s3/FILL_ME_IN', // CHANGE TO S3 PRSIGNED URL - need to generate on backend to make put
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify({
                    file_name: `quality_install_${projectDoc.metadata_.doc_name || 'Untitled Project'}_${Date.now()}.pdf`,
                    file_type: 'application/pdf',
                }),
            },
        )
        const s3Data = await s3Response.json()
        if (!s3Data.success) {
            console.error('Failed to get S3 presigned URL:', s3Data)
            return
        }
        console.log('Uploading PDF to S3:', s3Data.url)
        const uploadResponse = await fetch(s3Data.url, {
            method: 'PUT',
            body: pdfBlob,
            headers: { 'Content-Type': 'application/pdf' },
        })
        if (!uploadResponse.ok) {
            console.error('Failed to upload PDF to S3:', uploadResponse)
            return
        }
        let formId = localStorage.getItem('form_id')
        const updateResponse = await fetch(
            `http://localhost:5000/api/quality-install/${formId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify({ s3_file_url: s3Data.url }),
            },
        )
        const updateData = await updateResponse.json()
        if (updateData.success) {
            console.log(
                'Successfully saved project and updated DB with S3 URL:',
                updateData,
            )
        } else {
            console.error('Failed to update DB with S3 file URL:', updateData)
        }
        const { processId, userId, processStepId } = extractLocalStorageData()
        const conditionResponse = await fetch(
            `http://localhost:5000/api/process/${processId}/step/${processStepId}/condition`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify({ condition: 'CLOSED' }),
            },
        )
        if (!conditionResponse.ok) {
            console.error(
                'Failed to update step condition to CLOSED:',
                conditionResponse,
            )
            return
        }
        const projectDocName = projectDoc.metadata_.doc_name
        const conditionData = await conditionResponse.json()
        console.log('Step condition updated:', conditionData)
        const NewQualityInstallSubmissionData =
            await storeNewQualityInstallSubmission(
                projectDocName,
                [],
                formId,
                userId,
                processId,
                processStepId,
            )
        console.log('Local Storage Updated:', NewQualityInstallSubmissionData)
    } catch (error) {
        console.error('Error in saveProjectAndUploadToS3:', error)
    }
}

function storeNewQualityInstallSubmission(
    submissionName: string,
    formData: any,
    applicationId: any,
    userId: string,
    processId: string,
    stepId: string,
    localStorageKey = 'quality_install_submission',
) {
    const newObject = {
        [submissionName]: {
            form_data: formData,
            application_id: applicationId,
            user_id: userId,
            process_id: processId,
            step_id: stepId,
        },
    }

    localStorage.setItem(localStorageKey, JSON.stringify(newObject))
}

function extractLocalStorageData() {
    const prequalificationData = localStorage.getItem(
        'formData_prequalification',
    )
    let processId = null
    let userId = null

    if (prequalificationData) {
        try {
            const parsedData = JSON.parse(prequalificationData)
            processId = parsedData.process_id || null
            userId = parsedData.user?.user_id || null
        } catch (error) {
            console.error('Error parsing formData_prequalification:', error)
        }
    }
    let processStepId = localStorage.getItem('process_step_id') || ''
    return {
        processId: processId,
        userId: userId,
        processStepId: processStepId,
    }
}

export const isFormComplete = (formData: any, metadata?: any): boolean => {
    if (!formData) return false
    if (!formData.installer) {
        console.warn('Missing required installer data')
        return false
    }

    const installerFields = [
        'name',
        'company_name',
        'mailing_address',
        'phone',
        'email',
    ]
    for (const field of installerFields) {
        if (
            !formData.installer[field] ||
            formData.installer[field].trim() === ''
        ) {
            return false
        }
    }
    if (!formData.location) {
        return false
    }
    const locationFields = ['street_address', 'city', 'state', 'zip_code']
    for (const field of locationFields) {
        if (
            !formData.location[field] ||
            formData.location[field].trim() === ''
        ) {
            return false
        }
    }
    return true
}

export const autoSaveToRDS = async () => {
    const { processId, userId, processStepId } = extractLocalStorageData()
    const formData = {
        user_id: userId,
        process_step_id: processStepId,
        form_data: window.docData || {},
    }
    try {
        let response
        const formId = localStorage.getItem('form_id')
        if (formId) {
            response = await fetch(
                `http://localhost:5000/api/quality-install/${formId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                    body: JSON.stringify(formData),
                },
            )
        } else {
            response = await fetch(
                'http://localhost:5000/api/quality-install',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                    body: JSON.stringify(formData),
                },
            )
        }
        const data = await response.json()
        if (data.success) {
            if (!formId) {
                localStorage.setItem('form_id', data.form_id)
            }
        }
    } catch (error) {
        console.error('Error auto-saving:', error)
    }
}

export function persistSessionState({
    userId,
    applicationId,
    processId,
    processStepId,
}: {
    userId?: string | null
    applicationId?: string | null
    processId?: string | null
    processStepId?: string | null
}) {
    if (userId) localStorage.setItem('user_id', userId)
    if (applicationId) localStorage.setItem('application_id', applicationId)
    if (processId) localStorage.setItem('process_id', processId)
    if (processStepId) localStorage.setItem('process_step_id', processStepId)
}
