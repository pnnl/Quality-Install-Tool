import React, { useState } from 'react'

import PhotoInput from './photo_input'
import { StoreContext } from '../providers/store_provider'
import {
    getNextPhotoAttachmentId,
    getPhotoAttachments,
} from '../utilities/photo_attachment_utils'

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

                const photoAttachmentId = getNextPhotoAttachmentId(
                    id,
                    photoAttachments,
                )

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
