import ImageBlobReduce from 'image-blob-reduce'
import React, { FC, useState } from 'react'

import { StoreContext } from './store'
import PhotoInput from './photo_input'
import PhotoMetadata from '../types/photo_metadata.type'

const MAX_IMAGE_DIM = 1280

interface PhotoInputWrapperProps {
    children: React.ReactNode
    id: string
    label: string
}

export const filterAttachmentsByIdPrefix = (
    attachments: { [s: string]: unknown } | ArrayLike<unknown>,
    idPrefix: string,
) => {
    return Object.entries(attachments)
        .filter((attachment: any) => attachment[0].startsWith(idPrefix))
        .map((attachment: any) => {
            return { id: attachment[0], data: attachment[1] }
        })
}

/**
 * A component that wraps a PhotoInput component in order to tie it to the data store
 *
 * @param children Content (most commonly markdown text) to be passed on as the PhotInput
 * children
 * @param id An identifier for the store attachment that represents the photo for
 * the PhotoInput component
 * @param label The label of the PhotoInput component
 */
const PhotoInputWrapper: FC<PhotoInputWrapperProps> = ({
    children,
    id,
    label,
}) => {
    return (
        <StoreContext.Consumer>
            {({
                attachments,
                upsertAttachment,
                removeAttachment,
                updateAttachmentMetaData,
            }) => {
                const upsertPhoto = (img_file: Blob, photoId: string) => {
                    // Reduce the image size as needed
                    ImageBlobReduce()
                        .toBlob(img_file, { max: MAX_IMAGE_DIM })
                        .then(blob => {
                            upsertAttachment(blob, photoId)
                        })
                }
                const photos = filterAttachmentsByIdPrefix(attachments, id)
                return (
                    <PhotoInput
                        label={label}
                        photos={photos}
                        upsertPhoto={upsertPhoto}
                        id={id}
                        removeAttachment={removeAttachment}
                        updateNotes={updateAttachmentMetaData}
                    >
                        {children}
                    </PhotoInput>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PhotoInputWrapper
