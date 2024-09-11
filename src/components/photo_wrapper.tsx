import React, { FC, useState } from 'react'
import PouchDB from 'pouchdb'

import { StoreContext } from './store'
import Photo from './photo'
import PhotoMetadata from '../types/photo_metadata.type'
import dbName from './db_details'
import { retrieveDocFromDB } from '../utilities/database_utils'

interface PhotoWrapperProps {
    children: React.ReactNode
    id: string
    label: string
    required: boolean
    docId: string
    project?: any
    fromParent?: boolean
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
    project,
    fromParent,
}) => {
    const [photoBlob, setPhotoBlob] = useState<Blob | Buffer>()
    const [projectDoc, setProjectDoc] = useState<any>(project)

    if (fromParent) {
        const projectDocId = project?._id ? project?._id : docId
        new PouchDB(dbName).get(projectDocId).then(res => {
            setProjectDoc(res)
        })
        new PouchDB(dbName)
            .getAttachment(docId, id)
            .then(res => {
                setPhotoBlob(res)
            })
            .catch(err => {
                /* Error occurs when photo not found */
            })
    }

    return (
        <StoreContext.Consumer>
            {({ attachments, data }) => {
                const attachment = Object.getOwnPropertyDescriptor(
                    attachments,
                    id,
                )?.value

                const photo = fromParent ? photoBlob : attachment?.blob

                let metadata = attachment?.metadata

                if (fromParent) {
                    const attachmentIdParts = id.split('.')

                    if (attachmentIdParts.length > 1) {
                        // Access nested attachment metadata using the split parts
                        const [firstPart, secondPart, thirdPart] =
                            attachmentIdParts
                        metadata =
                            projectDoc?.metadata_?.attachments[firstPart]?.[
                                secondPart
                            ]?.[thirdPart]
                    } else {
                        // Directly access attachment metadata if there's no nesting
                        metadata = projectDoc?.metadata_?.attachments[id]
                    }
                }

                return (
                    <Photo
                        description={children}
                        id={id}
                        label={label}
                        metadata={metadata}
                        photo={photo}
                        required={required}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PhotoWrapper
