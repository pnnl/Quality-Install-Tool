import PouchDB from 'pouchdb'
import React, { createContext, useCallback } from 'react'

import { useDatabase } from './database_provider'
import { type Base } from '../types/database.types'
import { immutableUpsert } from '../utilities/path_utils'
import { getPhotoMetadata, isPhoto } from '../utilities/photo_utils'

export function useChangeEventHandler(
    callback?: (
        error: PouchDB.Core.Error | null,
        result: PouchDB.Core.Response | null,
    ) => void | Promise<void>,
): (doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) => Promise<void> {
    const db = useDatabase()

    return useCallback(
        async (doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) => {
            try {
                const result = await db.put<Base>(doc)

                callback && (await callback(null, result))
            } catch (error) {
                callback && (await callback(error as PouchDB.Core.Error, null))
            }
        },
        [db, callback],
    )
}

export const StoreContext = createContext<{
    doc: (PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) | undefined
    upsertData: (path: string, value: unknown) => Promise<void>
    upsertMetadata: (path: string, value: unknown) => Promise<void>
    putAttachment: (
        attachmentId: PouchDB.Core.AttachmentId,
        blob: Blob,
        filename?: string,
    ) => Promise<void>
    removeAttachment: (attachmentId: PouchDB.Core.AttachmentId) => Promise<void>
    replaceDoc: (
        doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
    ) => Promise<void>
}>({
    doc: undefined,
    upsertData: async () => {
        return
    },
    upsertMetadata: async () => {
        return
    },
    putAttachment: async () => {
        return
    },
    removeAttachment: async () => {
        return
    },
    replaceDoc: async () => {
        return
    },
})

interface StoreProviderProps {
    doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta
    onChange?: (
        doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
    ) => void | Promise<void>
    children: React.ReactNode
}

const StoreProvider: React.FC<StoreProviderProps> = ({
    doc,
    onChange,
    children,
}) => {
    const upsertData = useCallback(
        async (path: string, value: unknown) => {
            if (onChange) {
                const lastModifiedAt = new Date()

                await onChange(
                    immutableUpsert(
                        `data_.${path}`,
                        {
                            ...doc,
                            metadata_: {
                                ...doc.metadata_,
                                last_modified_at: lastModifiedAt,
                            },
                        },
                        value,
                    ),
                )
            }
        },
        [doc, onChange],
    )

    const upsertMetadata = useCallback(
        async (path: string, value: unknown) => {
            if (onChange) {
                const lastModifiedAt = new Date()

                await onChange(
                    immutableUpsert(
                        `metadata_.${path}`,
                        {
                            ...doc,
                            metadata_: {
                                ...doc.metadata_,
                                last_modified_at: lastModifiedAt,
                            },
                        },
                        value,
                    ),
                )
            }
        },
        [doc, onChange],
    )

    const putAttachment = useCallback(
        async (
            attachmentId: PouchDB.Core.AttachmentId,
            blob: Blob,
            filename?: string,
        ) => {
            if (onChange) {
                const lastModifiedAt = new Date()

                const attachmentMetadata = isPhoto(blob)
                    ? await getPhotoMetadata(blob)
                    : {
                          filename,
                          timestamp: lastModifiedAt.toISOString(),
                      }

                await onChange({
                    ...doc,
                    _attachments: {
                        ...doc._attachments,
                        [attachmentId]: {
                            content_type: blob.type,
                            data: blob,
                        },
                    },
                    metadata_: {
                        ...doc.metadata_,
                        last_modified_at: lastModifiedAt,
                        attachments: {
                            ...doc.metadata_.attachments,
                            [attachmentId]: attachmentMetadata,
                        },
                    },
                })
            }
        },
        [doc, onChange],
    )

    const removeAttachment = useCallback(
        async (attachmentId: PouchDB.Core.AttachmentId) => {
            if (onChange) {
                const lastModifiedAt = new Date()

                const _attachments = {
                    ...doc._attachments,
                }

                delete _attachments[attachmentId]

                const metadata_ = {
                    ...doc.metadata_,
                    last_modified_at: lastModifiedAt,
                    attachments: {
                        ...doc.metadata_.attachments,
                    },
                }

                delete metadata_.attachments[attachmentId]

                await onChange({
                    ...doc,
                    _attachments,
                    metadata_,
                })
            }
        },
        [doc, onChange],
    )

    const replaceDoc = useCallback(
        async (doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) => {
            onChange && (await onChange(doc))
        },
        [onChange],
    )

    return (
        <StoreContext.Provider
            value={{
                doc,
                upsertData,
                upsertMetadata,
                putAttachment,
                removeAttachment,
                replaceDoc,
            }}
        >
            {children}
        </StoreContext.Provider>
    )
}

export default StoreProvider
