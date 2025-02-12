import { get } from 'lodash'
import PouchDB from 'pouchdb'
import React, { useEffect, useState } from 'react'

import Photo from './photo'
import { useDatabase } from '../providers/database_provider'
import { StoreContext } from '../providers/store_provider'
import { type Base, type PhotoMetadata } from '../types/database.types'

async function getMatchingAttachmentsFromParent(
    db: PouchDB.Database<Base>,
    projectDocId: PouchDB.Core.DocumentId,
    id: PouchDB.Core.AttachmentId,
): Promise<
    {
        id: string
        photo: Blob | undefined
        metadata: PhotoMetadata | undefined
    }[]
> {
    const doc = await db.get(projectDocId, { attachments: true, binary: true })

    const attachments = (doc._attachments ?? {}) as PouchDB.Core.Attachments

    // Filter attachments whose IDs start with given 'id;
    return Object.keys(attachments)
        .filter(attachmentId => attachmentId.startsWith(id))
        .map(attachmentId => {
            const attachment = attachments[
                attachmentId
            ] as PouchDB.Core.FullAttachment

            const photoBlob = attachment.data as Blob

            const attachmentIdParts = attachmentId.split('.')

            /* Fetching location metadata for objects stored in as nested objects
             *  Example: Combustion safety testing photos are stored as 'combustion_safety_tests.A1.water_heater_photo_0'
             */
            let location_metadata = doc.metadata_?.attachments[
                attachmentId
            ] as PhotoMetadata

            if (attachmentIdParts.length === 3) {
                // Access nested attachment metadata using the split parts
                const [firstPart, secondPart, thirdPart] = attachmentIdParts
                location_metadata = (
                    doc.metadata_.attachments[firstPart] as any
                )?.[secondPart]?.[thirdPart]
            }

            return {
                id: attachmentId,
                photo: photoBlob, // Blob data
                metadata: location_metadata, // Metadata if available
            }
        })
}

function getMatchingAttachments(
    doc: (PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) | undefined,
    id: PouchDB.Core.AttachmentId,
): {
    id: string
    photo: Blob | undefined
    metadata: PhotoMetadata | undefined
}[] {
    if (doc && doc._attachments) {
        return Object.keys(doc._attachments)
            .filter(key => key.startsWith(id))
            .map(key => {
                return {
                    id: key,
                    photo: (
                        doc?._attachments?.[key] as PouchDB.Core.FullAttachment
                    )?.data as Blob,
                    metadata: doc?.metadata_.attachments[key] as PhotoMetadata,
                }
            })
    } else {
        return []
    }
}

interface PhotoWrapperProps {
    children: React.ReactNode
    id: string
    label: string
    required: boolean
    docId: string
    parent?: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta
}

/**
 * A component that wraps a Photo component in order to tie it to the data store
 *
 * @param children Content (most commonly markdown text) to be passed on to the Photo
 * component
 * @param id An identifier for the store attachment that represents the photo for
 * the Photo component
 * @param label The label of the Photo component
 * @param required When unset, the Photo component will only show if there is a
 * photo attachment in the data store with the given id. When set, the Photo component
 * will always show and the Photo component will indicate when the photo is missing.
 * @param project Optional field. Project doc, for Building number photo
 */
const PhotoWrapper: React.FC<PhotoWrapperProps> = ({
    children,
    id,
    label,
    required,
    docId,
    parent,
}) => {
    const db = useDatabase()

    const [matchingAttachments, setMatchingAttachments] = useState<
        {
            id: string
            photo: Blob | undefined
            metadata: PhotoMetadata | undefined
        }[]
    >([])

    useEffect(() => {
        if (parent) {
            getMatchingAttachmentsFromParent(db, parent._id, id).then(
                matchingAttachments => {
                    setMatchingAttachments(matchingAttachments)
                },
            )
        }
    }, [parent])

    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                const noteValue = doc && get(doc.data_, `${id}_note`)

                return (
                    <Photo
                        description={children}
                        label={label}
                        photos={
                            parent
                                ? matchingAttachments
                                : getMatchingAttachments(doc, id)
                        }
                        required={required}
                        noteValue={noteValue ?? ''}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PhotoWrapper
