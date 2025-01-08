import React, { FC, useEffect, useState } from 'react'

import imageCompression from 'browser-image-compression'

import { StoreContext } from './store'
import PhotoInput from './photo_input'
import PhotoMetadata from '../types/photo_metadata.type'

import { getMetadataFromPhoto, photoProperties } from '../utilities/photo_utils'
import JSONValue from '../types/json_value.type'

interface PhotoInputWrapperProps {
    children: React.ReactNode
    id: string
    label: string
    uploadable: boolean
    count?: number
    notes?: boolean
}

interface JSONObject {
    [key: string]: JSONValue
}
//This function takes a data object from the StoreContext and converts it into an object
//whose values we can access via string-type keys
function convertDataObject(data: {}): JSONObject {
    let jsonObject = data as JSONObject
    let newDataObject: JSONObject = {}

    for (const key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            newDataObject[key] = jsonObject[key]
        }
    }
    return newDataObject
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
 * @param note Boolean from the mdx component that indicates whether the notes field will be available
 */
const PhotoInputWrapper: FC<PhotoInputWrapperProps> = ({
    children,
    id,
    label,
    uploadable,
    count = 10,
    notes,
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

    // Function to find the max number at the end of the attachment name, and return the new  attachment name with max number
    function getMaxKeyWithNumberSuffix(keys: (string | any[])[], id: string) {
        let maxNumber = -1
        let maxKey: string | any[] = ''
        // Loop through each key
        keys.forEach((key: string | any[]) => {
            const lastChar = key[key.length - 1] // Get the last character of the key
            if (!isNaN(lastChar)) {
                // Check if the last character is a number
                const number = parseInt(lastChar, 10) // Convert last character to a number
                if (number > maxNumber) {
                    maxNumber = number
                    maxKey = key
                }
            }
        })
        // return the new key with the incremented number
        if (maxNumber > -1) {
            const newKey = `${maxKey.substring(0, maxKey.length - 1)}${
                maxNumber + 1
            }`
            return newKey
        }
        // else return first key with '_0'
        return id + '_' + 0
    }

    // Dynamically imports the `heic2any` module.
    // This helps to reduce initial bundle size and improve
    // performance by only loading the library when needed.
    async function loadHeic2Any() {
        const { default: heic2any } = await import('heic2any')
        return heic2any
    }

    return (
        <StoreContext.Consumer>
            {({
                metadata,
                attachments,
                upsertAttachment,
                deleteAttachment,
            }) => {
                const deletePhoto = (photoId: string) => {
                    deleteAttachment(photoId)
                }
                const matchingAttachments: {
                    id: string
                    photo: any
                    metadata: any
                }[] = []

                Object.keys(attachments).forEach(key => {
                    // If the attachment name starts with the specified prefix
                    if (key.startsWith(id)) {
                        // Add the attachment information to the result array
                        const attachment_data = Object.getOwnPropertyDescriptor(
                            attachments,
                            key,
                        )?.value

                        let location_metadata: PhotoMetadata =
                            attachment_data?.metadata
                        if (!location_metadata) {
                            /* Fetching location metadata for objects stored in as nested objects
                             *  Example: Combustion safety testing photos are stored as 'combustion_safety_tests.A1.water_heater_photo_0'
                             */
                            const attachmentIdParts = key.split('.')
                            if (attachmentIdParts.length > 1) {
                                // Access nested attachment metadata using the split parts
                                const [firstPart, secondPart, thirdPart] =
                                    attachmentIdParts
                                location_metadata = (metadata as any)
                                    ?.attachments[firstPart]?.[secondPart]?.[
                                    thirdPart
                                ]
                            }
                        }

                        matchingAttachments.push({
                            id: key,
                            photo: attachment_data?.blob,
                            metadata: location_metadata,
                        })
                    }
                })

                const upsertPhoto = async (imgFile: Blob) => {
                    setLoading(true)
                    const nextKey = getMaxKeyWithNumberSuffix(
                        matchingAttachments.map(({ id }) => id),
                        id,
                    )

                    const handleImageUpsert = async (file: Blob) => {
                        const photoMetadata =
                            await getMetadataFromPhoto(imgFile)
                        upsertAttachment(
                            file,
                            nextKey,
                            undefined,
                            photoMetadata,
                        )
                        setError('')
                    }

                    try {
                        if (imgFile.type === 'image/heic') {
                            const heic2any = await loadHeic2Any()
                            const jpegBlob: any = await heic2any({
                                blob: imgFile,
                                toType: 'image/jpeg',
                            })
                            const compressedFile = await compressFile(jpegBlob)
                            await handleImageUpsert(compressedFile)
                        } else {
                            const compressedPhotoBlob =
                                await compressFile(imgFile)
                            await handleImageUpsert(compressedPhotoBlob)
                        }
                    } catch (error) {
                        console.error('Image processing error:', error)
                        setError('Image loading failed')
                    } finally {
                        setLoading(false)
                    }
                }

                return (
                    <>
                        <PhotoInput
                            label={label}
                            metadata={matchingAttachments.map(
                                item => item.metadata,
                            )}
                            photos={matchingAttachments}
                            upsertPhoto={upsertPhoto}
                            uploadable={uploadable}
                            deletePhoto={deletePhoto}
                            loading={loading}
                            error={error}
                            count={count}
                            id={id}
                            notes={notes}
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
