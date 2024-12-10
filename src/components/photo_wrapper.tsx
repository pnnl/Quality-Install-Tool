import React, { FC, useEffect, useState } from 'react'

import { StoreContext } from './store'
import Photo from './photo'
import { getAttachmentBlob, useDB } from '../utilities/database_utils'

interface PhotoWrapperProps {
    children: React.ReactNode
    id: string
    label: string
    required: boolean
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
    parent,
}) => {
    const [photoBlob, setPhotoBlob] = useState<Blob | Buffer>()
    const [projectDoc, setProjectDoc] = useState<any>(parent)
    const db = useDB()

    useEffect(() => {
        if (parent) {
            setProjectDoc(parent)
            getAttachmentBlob(db, parent?._id, id)
                .then(blob => {
                    setPhotoBlob(blob)
                })
                .catch(error => {})
        }
    }, [])

    return (
        <StoreContext.Consumer>
            {({ attachments, data }) => {
                const attachment = Object.getOwnPropertyDescriptor(
                    attachments,
                    id,
                )?.value

                const photo = parent ? photoBlob : attachment?.blob
                let metadata = attachment?.metadata

                if (parent) {
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
