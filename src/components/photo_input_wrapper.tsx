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
                        onPutPhotoAttachment={async blob => {
                            // Start loading and reset previous states
                            setIsLoading(true)
                            setError(undefined)

                            // Detailed loading messages
                            try {
                                // Check file type
                                if (!isPhoto(blob)) {
                                    throw new Error('Invalid file type')
                                }

                                // Provide loading feedback
                                setLoadingMessage('Preparing photo...')
                                console.log('Starting photo attachment process')

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

                                console.log('Photo attachment completed')
                                setLoadingMessage(undefined)
                                setError(undefined)
                            } catch (cause) {
                                // Detailed error handling
                                const errorMessage =
                                    cause instanceof Error
                                        ? cause.message
                                        : String(cause)

                                console.error(
                                    'Photo attachment error:',
                                    cause,
                                    loadingMessage,
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
