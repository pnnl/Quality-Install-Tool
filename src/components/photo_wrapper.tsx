import React, { FC, useEffect, useState } from 'react'

import { StoreContext } from './store'
import Photo from './photo'
import { useDB } from '../utilities/database_utils'

interface PhotoWrapperProps {
    children: React.ReactNode
    id: string
    label: string
    required: boolean
    docId: string
    parent?: any
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
const PhotoWrapper: FC<PhotoWrapperProps> = ({
    children,
    id,
    label,
    required,
    docId,
    parent,
}) => {
    const [matchingAttachments, setMatchingAttachments] = useState<any>({})
    const [projectDoc, setProjectDoc] = useState<any>(parent)
    const db = useDB()

    useEffect(() => {
        if (parent) {
            const projectId = parent?._id || docId
            getMatchingAttachmentsFromParent(projectId)
        }
    }, [parent])

    const getMatchingAttachmentsFromParent = (projectDocId: any) => {
        db.get(projectDocId, { attachments: true })
            .then((doc: { metadata_: any; _attachments: any }) => {
                // Filter attachments whose IDs start with given 'id;
                const matchingAttachments = Object.keys(doc._attachments)
                    .filter(attachmentId => attachmentId.startsWith(id))
                    .map(attachmentId => {
                        const attachment = doc._attachments[attachmentId]

                        // Decode the Base64 data to a Blob
                        const byteCharacters = Uint8Array.from(
                            window.atob(attachment.data),
                            c => c.charCodeAt(0),
                        )
                        const photoBlob = new Blob([byteCharacters], {
                            type: attachment.content_type,
                        })

                        const attachmentIdParts = attachmentId.split('.')
                        /* Fetching location metadata for objects stored in as nested objects
                         *  Example: Combustion safety testing photos are stored as 'combustion_safety_tests.A1.water_heater_photo_0'
                         */
                        let location_metadata =
                            doc.metadata_?.attachments?.[attachmentId]
                        if (attachmentIdParts.length > 1) {
                            // Access nested attachment metadata using the split parts
                            const [firstPart, secondPart, thirdPart] =
                                attachmentIdParts
                            location_metadata =
                                doc?.metadata_?.attachments[firstPart]?.[
                                    secondPart
                                ]?.[thirdPart]
                        }

                        return {
                            id: attachmentId,
                            photo: photoBlob, // Blob data
                            metadata: location_metadata, // Metadata if available
                        }
                    })

                setMatchingAttachments(matchingAttachments)
                // Set the filtered attachments in state
                setProjectDoc(doc) // Set the full document if needed
            })
            .catch((err: any) => {
                console.error('Failed to get matching attachments:', err)
            })
    }
    const getMatchingAttachments = (attachments: {}, id: string) => {
        const matchingAttachments: {
            id: string
            photo: any
            metadata: any
        }[] = []

        Object.keys(attachments).forEach(key => {
            // If the attachment name starts with the specified prefix
            if (key.startsWith(id)) {
                // Add the attachment information to the result array
                const attachment_data = Object.getOwnPropertyDescriptor(
                    attachments,
                    key,
                )?.value

                matchingAttachments.push({
                    id: key,
                    photo: attachment_data?.blob,
                    metadata: attachment_data?.metadata,
                })
            }
        })
        return matchingAttachments
    }

    return (
        <StoreContext.Consumer>
            {({ attachments, data }) => {
                return (
                    <Photo
                        description={children}
                        label={label}
                        photos={
                            parent
                                ? matchingAttachments
                                : getMatchingAttachments(attachments, id)
                        }
                        required={required}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PhotoWrapper
