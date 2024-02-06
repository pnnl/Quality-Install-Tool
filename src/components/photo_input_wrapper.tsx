import ImageBlobReduce from 'image-blob-reduce'
import React, { FC } from 'react'

import { StoreContext } from './store'
import PhotoInput from './photo_input'
import PhotoMetadata from '../types/photo_metadata.type'

const MAX_IMAGE_DIM = 500

interface PhotoInputWrapperProps {
    children: React.ReactNode
    id: string
    label: string
    uploadable: boolean
}

/**
 * A component that wraps a PhotoInput component in order to tie it to the data store
 *
 * @param children Content (most commonly markdown text) to be passed on as the PhotInput
 * children
 * @param id An identifier for the store attachment that represents the photo for
 * the PhotoInput component
 * @param label The label of the PhotoInput component
 * @param uploadable When set, the PhotoInput component will open the gallery to upload the photo.
 *                   When unset, the PhotoInput component will use device camera for taking new photo.
 */
const PhotoInputWrapper: FC<PhotoInputWrapperProps> = ({
    children,
    id,
    label,
    uploadable,
}) => {
    return (
        <StoreContext.Consumer>
            {({ attachments, upsertAttachment, jobId }) => {
                //  JobId for installation level updates
                let id_ref = jobId == '' ? id : jobId + '.' + id

                const upsertPhoto = (img_file: Blob) => {
                    // Reduce the image size as needed
                    ImageBlobReduce()
                        .toBlob(img_file, { max: MAX_IMAGE_DIM })
                        .then(blob => {
                            upsertAttachment(blob, id_ref)
                        })
                }
                return (
                    <PhotoInput
                        label={label}
                        metadata={
                            attachments[id_ref]
                                ?.metadata as unknown as PhotoMetadata
                        }
                        photo={attachments[id_ref]?.blob}
                        upsertPhoto={upsertPhoto}
                        uploadable={uploadable}
                    >
                        {children}
                    </PhotoInput>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PhotoInputWrapper
