import heic2any from 'heic2any'
import React, { useState } from 'react'

import PhotoInput from './photo_input'
import { StoreContext } from '../providers/store_provider'
import { getPhotoAttachments } from '../utilities/photo_attachment_utils'
import { compressPhoto } from '../utilities/photo_utils'

interface PhotoInputWrapperProps {
    children: React.ReactNode
    id: string
    label: string
    uploadable: boolean
    count?: number
    notes?: boolean
}

const PhotoInputWrapper: React.FC<PhotoInputWrapperProps> = ({
    children,
    id,
    label,
    uploadable,
    count = 10,
    notes,
}) => {
    const [error, setError] = useState<string | undefined>(undefined)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (
        <StoreContext.Consumer>
            {({ doc, putAttachment, removeAttachment }) => {
                const photoAttachments = doc ? getPhotoAttachments(doc, id) : []

                const photoAttachmentId = `${id}_${
                    1 +
                    Math.max(
                        -1,
                        ...photoAttachments
                            .map(({ attachmentId }) => {
                                return attachmentId.match(
                                    /^(.*?)_(0|[1-9][0-9]*)$/i,
                                )
                            })
                            .filter(result => {
                                return result !== null
                            })
                            .map(result => {
                                return parseInt(result[2])
                            })
                            .filter(num => {
                                return !isNaN(num)
                            }),
                    )
                }`

                return (
                    <PhotoInput
                        label={label}
                        uploadable={uploadable}
                        loading={isLoading}
                        error={error}
                        count={count}
                        id={id}
                        notes={notes}
                        photoAttachments={photoAttachments}
                        onPutPhotoAttachment={async blob => {
                            setIsLoading(true)

                            try {
                                if (blob.type === 'image/heic') {
                                    blob = (await heic2any({
                                        blob,
                                        toType: 'image/jpeg',
                                    })) as Blob
                                }

                                blob = await compressPhoto(blob)

                                await putAttachment(
                                    photoAttachmentId,
                                    blob,
                                    undefined,
                                )

                                setError(undefined)
                            } catch (cause) {
                                setError(cause as string)
                            } finally {
                                setIsLoading(false)
                            }
                        }}
                        onRemovePhotoAttachment={removeAttachment}
                    >
                        {children}
                    </PhotoInput>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PhotoInputWrapper
