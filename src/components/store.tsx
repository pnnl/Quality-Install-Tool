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
import { getMetadataFromCurrentGPSLocation } from '../utilities/photo_utils'
import type Attachment from '../types/attachment.type'
import type { Objectish, NonEmptyArray } from '../types/misc_types.type'
import type Metadata from '../types/metadata.type'
import { putNewDoc } from '../utilities/database_utils'

PouchDB.plugin(PouchDBUpsert)

type UpsertAttachment = (blob: Blob, id: string) => void

type UpsertData = (pathStr: string, data: any) => void

type UpsertDoc = (pathStr: string, data: any) => void

type Attachments = Record<
    string,
    | Attachment
    | { blob: Blob; digest: string; metadata: Record<string, JSONValue> }
>

export const StoreContext = React.createContext({
    attachments: {} satisfies Attachments,
    data: {} satisfies JSONValue,
    metadata: {} satisfies Metadata | undefined,
    upsertAttachment: ((blob: Blob, id: any) => {}) as UpsertAttachment,
    upsertData: ((pathStr: string, data: any) => {}) as UpsertData,
    upsertDoc: ((pathStr: string, data: any) => {}) as UpsertDoc,
})

interface StoreProviderProps {
    children: ReactNode
    dbName: string
    docId: string
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
}) => {
    const changesRef = useRef<PouchDB.Core.Changes<{}>>()
    const revisionRef = useRef<string>()
    // The attachments state will have the form: {[att_id]: {blob, digest, metadata}, ...}
    const [attachments, setAttachments] = useState<Record<string, Attachment>>(
        {},
    )
    const [db, setDB] = useState<PouchDB.Database>()
    // The doc state could be anything that is JSON-compatible
    const [doc, setDoc] = useState<Objectish>({})
    const [data, setData] = useState<JSONValue>({})
    const [metadata, setMetaData] = useState<Metadata | undefined>(undefined)

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
        if (db && Boolean(dbDoc.hasOwnProperty('data_'))) {
            setData(dbDoc.data_)
        }

        if (db && dbDoc.hasOwnProperty('metadata_')) {
            setMetaData(dbDoc.metadata_)
        }

        // Update the attachments state as needed
        // Note: dbDoc will not have a _attachments field if the document has no attachments
        if (db && dbDoc.hasOwnProperty('_attachments')) {
            // Collect all the new or modified attachments
            const dbDocAttachments = dbDoc._attachments
            const attachmentsMetadata = dbDoc.metadata_.attachments
            let newAttachments: Record<string, Attachment> = {}
            for (const attachmentId in dbDocAttachments) {
                const docAttachment = dbDocAttachments[attachmentId]
                const singleAttachmentMetadata =
                    attachmentsMetadata[attachmentId]
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
                            blob.type === 'image/jpeg'
                                ? (singleAttachmentMetadata as Record<
                                      string,
                                      any
                                  >)
                                : {}

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
            // Establish a database connection
            const db = new PouchDB(dbName, { auto_compaction: true })
            setDB(db)

            // Initialize the DB document as needed
            try {
                // It looks like the type def for putIfNotExists does not match its implementation
                // TODO: Check this over carefully
                const result = (await putNewDoc(db, docId)) as unknown
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
        })()

        // Cancel the DB subscription just before the component unmounts
        return () => {
            if (changesRef.current != null) {
                changesRef.current.cancel()
            }
        }

        // Run this effect after the first render and whenever the dbName prop changes
    }, [dbName])

    /**
     * Updates (or inserts) data into the doc state and persists the new doc
     *
     * @remarks
     * The given path is gauranteed to exist after the update/insertion.
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
                        created_at: new Date(),
                        last_modified_at: new Date(),
                    }
                } else {
                    result.metadata_.last_modified_at = new Date()
                }
                return result
            })
                .then(function (res) {
                    if (pathStr.includes('metadata_')) {
                        revisionRef.current = res.rev
                    }
                })
                .catch(function (err: Error) {
                    console.error('upsert error:', err)
                })
        }
    }

    /**
     * Updates (or inserts) data into the data_ state by invoking updatedDoc function
     *
     * @remarks
     * This function is typically passed to an input wrapper component via the StoreContext.Provider value
     * This function calls updateDoc, with the path to "data_" in dbDoc.
     *
     * @param pathStr A string path such as "foo.bar[2].biz" that represents a path into the doc state
     * @param data The data that is to be updated/inserted at the path location in the data state
     */
    const upsertData: UpsertData = (pathStr, data) => {
        pathStr = 'data_.' + pathStr
        upsertDoc(pathStr, data)
    }
    /**
     *
     * @param blob
     * @param id
     */
    const upsertAttachment: UpsertAttachment = async (blob, id) => {
        // Create the metadata for the blob
        const metadata: Attachment['metadata'] =
            blob.type === 'image/jpeg'
                ? await getMetadataFromCurrentGPSLocation()
                : {}

        // Storing SingleAttachmentMetaData in the DB
        upsertDoc('metadata_.attachments.' + id, metadata)

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
                data,
                metadata,
                upsertAttachment,
                upsertData,
                upsertDoc,
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
function immutableUpsert(
    recipient: Objectish,
    path: NonEmptyArray<string>,
    target: any,
): Objectish {
    const [propName, ...newPath] = path
    const newRecipient = isObject(recipient)
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
