import heic2any from 'heic2any'
import PouchDB from 'pouchdb'
import React, { useState } from 'react'

import PhotoInput from './photo_input'
import { StoreContext } from '../providers/store_provider'
import { type PhotoMetadata } from '../types/database.types'
import { compressPhoto, getPhotoMetadata } from '../utilities/photo_utils'

// Function to find the max number at the end of the attachment name, and return the new  attachment name with max number
function getMaxKeyWithNumberSuffix(
    keys: (string | any[])[],
    id: string,
): string {
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
        const newKey = `${maxKey.substring(0, maxKey.length - 1)}${maxNumber + 1}`
        return newKey
    }
    // else return first key with '_0'
    return `${id}_0`
}

interface PhotoInputWrapperProps {
    children: React.ReactNode
    id: string
    label: string
    uploadable: boolean
    count?: number
    notes?: boolean
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
 * @param notes Boolean from the mdx component that indicates whether the notes field will be available
 */
const PhotoInputWrapper: React.FC<PhotoInputWrapperProps> = ({
    children,
    id,
    label,
    uploadable,
    count = 10,
    notes,
}) => {
    const [loading, setLoading] = useState<boolean>(false) // Loading state
    const [error, setError] = useState<string>('') // Loading state

    return (
        <StoreContext.Consumer>
            {({ doc, putAttachment, removeAttachment }) => {
                const deletePhoto = (photoId: string) => {
                    removeAttachment(photoId)
                }

                const matchingAttachments: {
                    id: string
                    photo: Blob
                    metadata: PhotoMetadata | undefined
                }[] = []

                Object.keys(
                    doc && doc._attachments ? doc._attachments : {},
                ).forEach(key => {
                    // If the attachment name starts with the specified prefix
                    if (key.startsWith(id)) {
                        // Add the attachment information to the result array
                        const attachment_data =
                            doc &&
                            doc._attachments &&
                            (doc._attachments[
                                key
                            ] as PouchDB.Core.FullAttachment)

                        let location_metadata =
                            doc &&
                            (doc.metadata_.attachments[key] as PhotoMetadata)

                        if (!location_metadata) {
                            /* Fetching location metadata for objects stored in as nested objects
                             *  Example: Combustion safety testing photos are stored as 'combustion_safety_tests.A1.water_heater_photo_0'
                             */
                            const attachmentIdParts = key.split('.')

                            if (attachmentIdParts.length === 3) {
                                // Access nested attachment metadata using the split parts
                                const [firstPart, secondPart, thirdPart] =
                                    attachmentIdParts
                                location_metadata =
                                    doc &&
                                    (
                                        doc.metadata_.attachments[
                                            firstPart
                                        ] as any
                                    )?.[secondPart]?.[thirdPart]
                            }
                        }

                        matchingAttachments.push({
                            id: key,
                            photo: attachment_data?.data as Blob,
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
                        putAttachment(nextKey, file, undefined)
                        setError('')
                    }

                    try {
                        if (imgFile.type === 'image/heic') {
                            const jpegBlob = (await heic2any({
                                blob: imgFile,
                                toType: 'image/jpeg',
                            })) as Blob
                            const compressedFile = await compressPhoto(jpegBlob)
                            await handleImageUpsert(compressedFile)
                        } else {
                            const compressedPhotoBlob =
                                await compressPhoto(imgFile)
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
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PhotoInputWrapper
