import PouchDB from 'pouchdb'
import React, { createContext, useCallback } from 'react'

import { useDatabase } from './database_provider'
import {
    type Base,
    type FileMetadata,
    type PhotoMetadata,
} from '../types/database.types'
import { immutableUpsert } from '../utilities/path_utils'
import {
    compressPhoto,
    getPhotoMetadata,
    isPhoto,
} from '../utilities/photo_utils'
import { getPhotoProfileFromDoc } from '../utilities/photo_resolution_utils'

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
    projectDoc: (PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) | undefined
    upsertData: (
        path: string,
        value: unknown,
        errors: string[],
    ) => Promise<void>
    upsertMetadata: (
        path: string,
        value: unknown,
        errors: string[],
    ) => Promise<void>
    putAttachment: (
        attachmentId: PouchDB.Core.AttachmentId,
        blob: Blob,
        filename?: string,
    ) => Promise<void>
    removeAttachment: (attachmentId: PouchDB.Core.AttachmentId) => Promise<void>
    UNSAFE_put: (
        doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
    ) => Promise<void>
}>({
    doc: undefined,
    projectDoc: undefined,
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
    UNSAFE_put: async () => {
        return
    },
})

interface StoreProviderProps {
    doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta
    projectDoc?: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta
    onChange?: (
        doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
    ) => void | Promise<void>
    children: React.ReactNode
}

const StoreProvider: React.FC<StoreProviderProps> = ({
    doc,
    projectDoc,
    onChange,
    children,
}) => {
    const upsertData = useCallback(
        async (path: string, value: unknown, errors: string[]) => {
            if (onChange) {
                const docWithErrors = immutableUpsert(
                    `metadata_.errors.data_.${path}`,
                    {
                        ...doc,
                        metadata_: {
                            ...(doc.metadata_ ?? {}),
                            errors: doc.metadata_?.errors ?? {
                                data_: {},
                                metadata_: {},
                            },
                        },
                    } as unknown as Record<string, unknown>,
                    errors,
                ) as unknown as typeof doc

                const lastModifiedAt = new Date()

                await onChange(
                    immutableUpsert(
                        `data_.${path}`,
                        {
                            ...docWithErrors,
                            metadata_: {
                                ...docWithErrors.metadata_,
                                last_modified_at: lastModifiedAt.toISOString(),
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
        async (path: string, value: unknown, errors: string[]) => {
            if (onChange) {
                const docWithErrors = immutableUpsert(
                    `metadata_.errors.metadata_.${path}`,
                    {
                        ...doc,
                        metadata_: {
                            ...(doc.metadata_ ?? {}),
                            errors: doc.metadata_?.errors ?? {
                                data_: {},
                                metadata_: {},
                            },
                        },
                    } as unknown as Record<string, unknown>,
                    errors,
                ) as unknown as typeof doc

                const lastModifiedAt = new Date()

                await onChange(
                    immutableUpsert(
                        `metadata_.${path}`,
                        {
                            ...docWithErrors,
                            metadata_: {
                                ...docWithErrors.metadata_,
                                last_modified_at: lastModifiedAt.toISOString(),
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

                let attachmentMetadata: FileMetadata | PhotoMetadata = {
                    filename,
                    timestamp: lastModifiedAt.toISOString(),
                }

                if (isPhoto(blob)) {
                    const profileSource = projectDoc ?? doc
                    const profile = getPhotoProfileFromDoc(profileSource)

                    const { blobs, mainFormat } = await compressPhoto(
                        blob,
                        profile,
                    )
                    const storedBlob = blobs[mainFormat] ?? blob
                    attachmentMetadata = await getPhotoMetadata(
                        blob,
                        storedBlob,
                    )

                    const attachments: PouchDB.Core.Attachments = {
                        ...doc._attachments,
                    }
                    Object.entries(blobs).forEach(([format, b]) => {
                        const ext = format === 'jpeg' ? 'jpg' : format
                        attachments[`${attachmentId}.${ext}`] = {
                            content_type:
                                format === 'jpeg'
                                    ? 'image/jpeg'
                                    : `image/${format}`,
                            data: b,
                        }
                    })

                    await onChange({
                        ...doc,
                        _attachments: attachments,
                        metadata_: {
                            ...doc.metadata_,
                            last_modified_at: lastModifiedAt.toISOString(),
                            attachments: {
                                ...doc.metadata_.attachments,
                                [attachmentId]: attachmentMetadata,
                            },
                        },
                    })
                    return
                }

                // Non-photo: store as usual
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
                        last_modified_at: lastModifiedAt.toISOString(),
                        attachments: {
                            ...doc.metadata_.attachments,
                            [attachmentId]: attachmentMetadata,
                        },
                    },
                })
            }
        },
        [doc, onChange, projectDoc],
    )

    const removeAttachment = useCallback(
        async (attachmentId: PouchDB.Core.AttachmentId) => {
            if (onChange) {
                const lastModifiedAt = new Date()

                const _attachments = {
                    ...doc._attachments,
                }

                const metadata_ = {
                    ...doc.metadata_,
                    last_modified_at: lastModifiedAt.toISOString(),
                    attachments: {
                        ...doc.metadata_.attachments,
                    },
                }

                const attachmentIdsToRemove = Object.keys(_attachments).filter(
                    key =>
                        key === attachmentId ||
                        key.startsWith(`${attachmentId}.`),
                )

                if (attachmentIdsToRemove.length > 0) {
                    attachmentIdsToRemove.forEach(key => {
                        delete _attachments[key]
                    })
                    delete metadata_.attachments[attachmentId]
                } else {
                    delete _attachments[attachmentId]
                    delete metadata_.attachments[attachmentId]
                }

                await onChange({
                    ...doc,
                    _attachments,
                    metadata_,
                })
            }
        },
        [doc, onChange],
    )

    const UNSAFE_put = useCallback(
        async (doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) => {
            if (onChange) {
                const lastModifiedAt = new Date()

                await onChange({
                    ...doc,
                    metadata_: {
                        ...doc.metadata_,
                        last_modified_at: lastModifiedAt.toISOString(),
                    },
                })
            }
        },
        [onChange],
    )

    return (
        <StoreContext.Provider
            value={{
                doc,
                projectDoc,
                upsertData,
                upsertMetadata,
                putAttachment,
                removeAttachment,
                UNSAFE_put,
            }}
        >
            {children}
        </StoreContext.Provider>
    )
}

export default StoreProvider
