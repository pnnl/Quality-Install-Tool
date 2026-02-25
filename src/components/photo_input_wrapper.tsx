import React, { useState } from 'react'
import PhotoInput from './photo_input'
import { StoreContext } from '../providers/store_provider'
import {
    getNextPhotoAttachmentId,
    getPhotoAttachments,
} from '../utilities/photo_attachment_utils'
import { isPhoto } from '../utilities/photo_utils'

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
    const [loadingMessage, setLoadingMessage] = useState<string | undefined>(
        undefined,
    )

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
                        loadingMessage={loadingMessage}
                        onPutPhotoAttachment={async blob => {
                            // Start loading and reset previous states
                            setIsLoading(true)
                            setError(undefined)

                            // Detailed loading messages
                            try {
                                // Check file type
                                if (!isPhoto(blob)) {
                                    console.error(
                                        `[PhotoUpload] File validation failed: Invalid file type. MIME type: ${blob.type}`,
                                    )
                                    throw new Error('Invalid file type')
                                }

                                if (process.env.NODE_ENV !== 'production') {
                                    console.info(
                                        `[PhotoUpload] Validation passed. File size: ${(blob.size / 1024).toFixed(2)}KB`,
                                    )
                                }

                                // Provide loading feedback
                                setLoadingMessage('Preparing photo...')
                                console.log(
                                    `[PhotoUpload] Starting photo attachment process for attachment ID: ${photoAttachmentId}`,
                                )

                                // Simulate a minimum loading time to ensure loader is visible
                                const startTime = Date.now()

                                // Use the existing putAttachment method
                                await putAttachment(photoAttachmentId, blob)

                                // Ensure minimum loading time of 500ms
                                const processingTime = Date.now() - startTime
                                if (processingTime < 500) {
                                    await new Promise(resolve =>
                                        setTimeout(
                                            resolve,
                                            500 - processingTime,
                                        ),
                                    )
                                }

                                console.log(
                                    `[PhotoUpload] Photo attachment completed successfully in ${processingTime}ms`,
                                )
                                setLoadingMessage(undefined)
                                setError(undefined)
                            } catch (cause) {
                                // Detailed error handling
                                const errorMessage =
                                    cause instanceof Error
                                        ? cause.message
                                        : String(cause)

                                console.error(
                                    `[PhotoUpload] Upload failed: ${errorMessage}`,
                                    {
                                        error: cause,
                                        attachmentId: photoAttachmentId,
                                    },
                                )
                                setError(errorMessage)
                                setLoadingMessage(undefined)
                            } finally {
                                // Ensure loading is set to false
                                setIsLoading(false)
                            }
                        }}
                        onRemovePhotoAttachment={async attachmentId => {
                            // Set loading during removal
                            setIsLoading(true)
                            setLoadingMessage('Removing photo...')
                            setError(undefined)

                            try {
                                await removeAttachment(attachmentId)
                                setLoadingMessage(undefined)
                            } catch (cause) {
                                const errorMessage =
                                    cause instanceof Error
                                        ? cause.message
                                        : String(cause)
                                setError(errorMessage)
                                setLoadingMessage(undefined)
                            } finally {
                                setIsLoading(false)
                            }
                        }}
                    >
                        {children}
                    </PhotoInput>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PhotoInputWrapper
