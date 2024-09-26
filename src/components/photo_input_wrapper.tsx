import ImageBlobReduce from 'image-blob-reduce'
import React, { FC, useState } from 'react'

import { StoreContext } from './store'
import PhotoInput from './photo_input'
import PhotoMetadata from '../types/photo_metadata.type'

import heic2any from 'heic2any'

import { getMetadataFromPhoto } from '../utilities/photo_utils'

const MAX_IMAGE_DIM_WIDTH = 500
const MAX_IMAGE_DIM_HEIGHT = 350

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
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    function compressJpegBlob(jpegBlob: Blob, quality = 0.7) {
        return new Promise((resolve, reject) => {
            // Load the JPEG blob into the image
            img.onload = () => {
                // Set canvas dimensions based on the loaded image
                canvas.width = Math.min(img.width, MAX_IMAGE_DIM_WIDTH)
                canvas.height = Math.min(img.height, MAX_IMAGE_DIM_HEIGHT)

                // Clear the canvas before drawing the new image
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                // Export the canvas as a compressed JPEG Blob
                canvas.toBlob(
                    compressedBlob => {
                        if (compressedBlob) {
                            resolve(compressedBlob) // Resolve with the compressed blob
                        } else {
                            reject(new Error('Compression failed'))
                        }
                    },
                    'image/jpeg',
                    quality,
                )
            }

            img.onerror = () => {
                reject(new Error('Image loading failed'))
            }

            img.src = URL.createObjectURL(jpegBlob) // Create an object URL for the blob
        })
    }

    return (
        <StoreContext.Consumer>
            {({ attachments, upsertAttachment }) => {
                const upsertPhoto = (img_file: Blob) => {
                    setLoading(true)
                    // Process and reducing the image size for HEIC images
                    if (img_file?.type === 'image/heic') {
                        // Convert HEIC to JPEG to be compatible to display in all browsers
                        heic2any({
                            blob: img_file,
                            toType: 'image/jpeg',
                            // conversion quality
                            // a number ranging from 0 to 1
                            quality: 1,
                        })
                            .then(jpegBlob => {
                                //Compress the image file to the configured size
                                compressJpegBlob(jpegBlob as Blob).then(
                                    compressed_photo_blob => {
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
                                    },
                                )
                            })
                            .catch(error => {
                                console.error('Conversion error:', error) // Handle errors
                            })
                            .finally(() => {
                                setLoading(false) // Reset loading state
                            })
                    }
                    // Reduce the image size - JPEG files
                    else
                        compressJpegBlob(img_file as Blob)
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
                            })
                            .catch(error => {
                                console.error('Conversion error:', error) // Handle errors
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
