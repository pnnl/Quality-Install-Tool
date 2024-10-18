import React, { FC, useState } from 'react'

import imageCompression from 'browser-image-compression'

import { StoreContext } from './store'
import PhotoInput from './photo_input'
import PhotoMetadata from '../types/photo_metadata.type'

import { getMetadataFromPhoto, photoProperties } from '../utilities/photo_utils'

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
    const [loading, setLoading] = useState(false) // Loading state
    const [error, setError] = useState('') // Loading state

    /**
     * Compresses an image file (Blob) while maintaining its aspect ratio and ensuring it does not exceed specified size limits.
     *
     * @param {Blob} imageBlob - The original image file as a Blob object that needs to be compressed.
     *
     * @returns {Promise<Blob | undefined>} - A Promise that resolves to the compressed image file as a Blob.
     *                                         If an error occurs during compression, it will be caught,
     *                                         and the function may return undefined.
     *
     * @throws {Error} - Throws an error if the compression process fails.
     *
     */
    async function compressFile(imageBlob: Blob) {
        /*The compressed file will have a maximum size of `maxSizeMB` 
         and dimensions constrained by`maxWidthOrHeight`. */
        const options = {
            maxSizeMB: photoProperties.MAX_SIZE_IN_MB,
            useWebWorker: true,
            maxWidthOrHeight: Math.max(
                photoProperties.MAX_IMAGE_DIM_HEIGHT,
                photoProperties.MAX_IMAGE_DIM_WIDTH,
            ),
        }
        const compressedFile = await imageCompression(
            imageBlob as File,
            options,
        )
        return compressedFile
    }

    // Dynamically imports the `heic2any` module.
    // This can help reduce initial bundle size and improve
    // performance by only loading the library when needed.
    async function loadHeic2Any() {
        const { default: heic2any } = await import('heic2any')
        return heic2any
    }

    return (
        <StoreContext.Consumer>
            {({ attachments, upsertAttachment }) => {
                const upsertPhoto = (img_file: Blob) => {
                    setLoading(true)
                    // Process and reducing the image size for HEIC images
                    if (img_file?.type === 'image/heic') {
                        // Convert HEIC to JPEG to be compatible to display in all browsers
                        loadHeic2Any().then(heic2any => {
                            heic2any({
                                blob: img_file,
                                toType: 'image/jpeg',
                            })
                                .then(jpegBlob => {
                                    compressFile(jpegBlob as Blob).then(
                                        compressed_file => {
                                            getMetadataFromPhoto(img_file).then(
                                                (photo_metadata: any) => {
                                                    upsertAttachment(
                                                        compressed_file as Blob,
                                                        id,
                                                        undefined,
                                                        photo_metadata,
                                                    )
                                                },
                                            )
                                        },
                                    )
                                    setError('')
                                })
                                .catch(error => {
                                    console.error('Conversion error:', error) // Handle errors
                                    setError('Image loading failed')
                                })
                                .finally(() => {
                                    setLoading(false) // Reset loading state
                                })
                        })
                    }
                    // Reduce the image size - JPEG files
                    else
                        compressFile(img_file as Blob)
                            .then(compressed_photo_blob => {
                                // Retrieve metadata from the uncompressed image file
                                getMetadataFromPhoto(img_file).then(
                                    (photo_metadata: any) => {
                                        upsertAttachment(
                                            compressed_photo_blob as Blob,
                                            id,
                                            undefined,
                                            photo_metadata,
                                        )
                                    },
                                )
                                setError('')
                            })
                            .catch(error => {
                                console.error('Compression error:', error) // Handle errors
                                setError('Image loading failed')
                            })
                            .finally(() => {
                                setLoading(false) // Reset loading state
                            })
                }
                const attachment = Object.getOwnPropertyDescriptor(
                    attachments,
                    id,
                )?.value
                return (
                    <>
                        <PhotoInput
                            label={label}
                            metadata={
                                attachment?.metadata as unknown as PhotoMetadata
                            }
                            photo={attachment?.blob}
                            upsertPhoto={upsertPhoto}
                            uploadable={uploadable}
                            loading={loading}
                            error={error}
                        >
                            {children}
                        </PhotoInput>
                    </>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PhotoInputWrapper
