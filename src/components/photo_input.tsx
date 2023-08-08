import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button, Card, Image, Modal, ModalBody } from 'react-bootstrap'
import { TfiGallery } from 'react-icons/tfi'
import Collapsible from './collapsible'
import PhotoMetadata from '../types/photo_metadata.type'
import ImageBlobReduce from 'image-blob-reduce'
import GpsCoordStr from './gps_coord_str'
import DateTimeStr from './date_time_str'
import NotesInput from './notes'

interface PhotoInputProps {
    children: React.ReactNode
    label: string
    photos: { id: string; data: { blob: Blob; metadata: PhotoMetadata } }[]
    upsertPhoto: (file: Blob, id: string) => void
    removeAttachment: (id: string) => void
    id: string
    maxPhotos?: number
    updateNotes?: (id: string, notes: string) => void
    disallowNotes?: boolean,
    metadata?: any
}

// TODO: Determine whether or not the useEffect() method is needed.
// We don't seem to need a separate camera button on an Android phone.
// However, we may need to request access to the camera
// before it can me used. Then clean up the corresponding code that is currently
// commented out.

/**
 * Component for photo input
 *
 * @param children Content (most commonly markdown text) describing the photo requirement
 * @param label Label for the photo requirement
 * @param metadata Abreviated photo metadata including timestamp and geolocation
 * @param photo Blob containing the photo itself
 * @param upsertPhoto Function used to update/insert a photo into the store
 */
const PhotoInput: FC<PhotoInputProps> = ({
    children,
    label,
    photos,
    upsertPhoto,
    removeAttachment,
    maxPhotos = 1,
    id,
    updateNotes,
    disallowNotes,
    metadata
}) => {
    // Create references to the hidden file inputs
    const hiddenPhotoCaptureInputRef = useRef<HTMLInputElement>(null)
    const hiddenPhotoUploadInputRef = useRef<HTMLInputElement>(null)
    const hiddenCameraInputRef = useRef<HTMLInputElement>(null)
    const photoIds = [photos.map(photo => photo.id.split('~').pop())]
    const [photoId, setPhotoId] = useState(
        photoIds.length > 0 ? Math.max(photoIds as any as number) : 0,
    )
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [cameraAvailable, setCameraAvailable] = useState(false)

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
    }

    // Handle button clicks
    const handlePhotoCaptureButtonClick = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        hiddenPhotoCaptureInputRef.current &&
            hiddenPhotoCaptureInputRef.current.click()
    }
    const handlePhotoGalleryButtonClick = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        hiddenPhotoUploadInputRef.current &&
            hiddenPhotoUploadInputRef.current.click()
    }

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
                setCameraAvailable(true)
            })
        }
    })

    const handleFileInputChange = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files)
            for (const file of files) {
                const imageBlobReduce = new ImageBlobReduce()
                setPhotoId(photoId + 1)
                const blob = await imageBlobReduce.toBlob(file)
                const blobId = `${id}~${photoId.toString()}`
                upsertPhoto(blob, blobId)
            }
            event.target.value = ''
        }
    }

    const handleFileDelete = (id: string) => {
        removeAttachment(id)
    }

    // Check if there is already a photo
    const hasPhoto = !!photos.length

    // Button text based on whether there is a photo or not
    const buttonText = 'Add Photo'

    return (
        <>
            <Card className="input-card">
                <Card.Body>
                    <Collapsible header={label}>
                        {/* Card.Text renders a <p> by defult. The children come from markdown
              and may be a <p>. Nested <p>s are not allowed, so we use a <div>*/}
                        <Card.Text as="div">{children}</Card.Text>
                    </Collapsible>
                    <input
                        accept="image/jpeg"
                        onChange={handleFileInputChange}
                        ref={hiddenPhotoUploadInputRef}
                        className="photo-upload-input"
                        type="file"
                        capture="environment"
                    />
                    {(
                        <>
                            {photos.map((photo, index) => (
                                <div
                                    className='photo-input-photos-container'
                                    key={index}
                                >
                                    <Card className="photo-card">
                                        <Card.Body>
                                            <>
                                                <Image
                                                    src={URL.createObjectURL(photo.data.blob)}
                                                    thumbnail
                                                />
                                                <br />
                                                <small>
                                                    Timestamp:{' '}
                                                    {photo.data.metadata?.timestamp ? (
                                                        <DateTimeStr
                                                            date={
                                                                photo.data.metadata.timestamp
                                                            }
                                                        />
                                                    ) : (
                                                        <span>Missing</span>
                                                    )}
                                                    <br />
                                                    Geolocation:{' '}
                                                    {
                                                        <span>
                                                            <GpsCoordStr
                                                                {...photo.data
                                                                    .metadata
                                                                    .geolocation}
                                                            />{' '}
                                                        </span>
                                                    }
                                                    {(updateNotes || !disallowNotes) &&
                                                        <NotesInput 
                                                            value={metadata.attachments[photo.id]?.notes}
                                                            updateValue={updateNotes}
                                                            id={photo.id}
                                                        />
                                                    }
                                                    {
                                                        <Button
                                                            className='photo-input-delete-button'
                                                            onClick={() =>
                                                                setShowDeleteModal(
                                                                    true,
                                                                )
                                                            }
                                                        >
                                                            {' '}
                                                            Delete Photo{' '}
                                                        </Button>
                                                    }
                                                </small>
                                                {handleFileDelete && (
                                                    <Modal
                                                        show={showDeleteModal}
                                                    >
                                                        <ModalBody>
                                                            <p>
                                                                Are you sure you
                                                                want to delete
                                                                this photo?
                                                            </p>
                                                            <div className='delete-modal-container'>
                                                                <Button
                                                                    onClick={() =>
                                                                        setShowDeleteModal(
                                                                            false,
                                                                        )
                                                                    }
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    className='delete-modal-delete'
                                                                    onClick={() => {
                                                                        handleFileDelete(
                                                                            photo.id,
                                                                        )
                                                                        setShowDeleteModal(
                                                                            false,
                                                                        )
                                                                    }}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                )}
                                            </>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                        </>
                    )}
                    {photos.length <= maxPhotos && (
                        <Button
                            onClick={handlePhotoGalleryButtonClick}
                            variant="outline-primary"
                        >
                            <TfiGallery /> {buttonText}{' '}
                        </Button>
                    )}
                </Card.Body>
            </Card>
        </>
    )
}

export default PhotoInput
