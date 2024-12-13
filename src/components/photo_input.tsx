import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button, Card, Image, Modal } from 'react-bootstrap'
import { TbCameraPlus } from 'react-icons/tb'

import Collapsible from './collapsible'
import DateTimeStr from './date_time_str'
import GpsCoordStr from './gps_coord_str'
import type PhotoMetaData from '../types/photo_metadata.type'
import { PHOTO_MIME_TYPES } from '../utilities/photo_utils'
import { TfiTrash } from 'react-icons/tfi'

interface PhotoInputProps {
    children: React.ReactNode
    label: string
    metadata: PhotoMetaData[]
    photos: { id: string; photo: Blob; metadata: PhotoMetaData }[] // Changed to array of photos with metadata
    upsertPhoto: (file: Blob) => void // Function to add new photo
    deletePhoto: (photoId: string) => void // Function to delete photo by index
    uploadable: boolean
    loading: boolean
    error: string
    count: number
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
 * @param metadata Abbreviated photo metadata including timestamp and geolocation
 * @param photo Blob containing the photo itself
 * @param upsertPhoto Function used to update/insert a photo into the store
 * @param uploadable When set, the PhotoInput component will open the gallery to upload the photo.
 *                   When unset, the PhotoInput component will use device camera for taking new photo (default).
 * @param loader  When set, a loading image will be displayed during the upload process.
 */
const PhotoInput: FC<PhotoInputProps> = ({
    children,
    label,
    metadata,
    photos,
    upsertPhoto,
    deletePhoto,
    uploadable,
    loading,
    error,
    count,
}) => {
    // Create references to the hidden file inputs
    const hiddenPhotoCaptureInputRef = useRef<HTMLInputElement>(null)
    const hiddenPhotoUploadInputRef = useRef<HTMLInputElement>(null)
    const [selectedPhotoIdToDelete, setSelectedPhotoIdToDelete] = useState('')
    const [selectedPhotoBlobToDelete, setSelectedPhotoBlobToDelete] =
        useState<Blob>()

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [cameraAvailable, setCameraAvailable] = useState(false)

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
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(() => {
                    setCameraAvailable(true) // Camera is available
                })
                .catch(error => {
                    console.error('Error accessing the camera: ', error)
                    setCameraAvailable(false) // Camera is not available
                    // You can also show a user-friendly message to the user if needed
                })
        } else {
            console.error('getUserMedia not supported in this browser.')
            setCameraAvailable(false) // Camera is not available
        }
    }, [])

    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0]
            upsertPhoto(file)
            // Reset the file input to allow re-selection of the same file
            event.target.value = '' // Reset the file input value
        }
    }

    // Button text
    const buttonText = 'Add Photo'

    function handleDeletePhoto(
        event: React.MouseEvent,
        id: string,
        photo: Blob,
    ) {
        event.stopPropagation()
        event.preventDefault()
        setSelectedPhotoIdToDelete(id)
        setShowDeleteConfirmation(true)
        setSelectedPhotoBlobToDelete(photo)
    }

    const confirmDeletePhoto = async () => {
        deletePhoto(selectedPhotoIdToDelete)
        setShowDeleteConfirmation(false)
        setSelectedPhotoIdToDelete('')
    }

    const cancelDeletePhoto = () => {
        setShowDeleteConfirmation(false)
        setSelectedPhotoIdToDelete('')
    }

    return (
        <>
            <Card className="input-card">
                <Card.Body>
                    <Collapsible header={label}>
                        {/* Card.Text renders a <p> by default. The children come from markdown
                            and may be a <p>. Nested <p>s are not allowed, so we use a <div> */}
                        <Card.Text as="div">{children}</Card.Text>
                    </Collapsible>

                    {uploadable ? (
                        <input
                            accept={PHOTO_MIME_TYPES.join(',')}
                            onChange={handleFileInputChange}
                            ref={hiddenPhotoUploadInputRef}
                            className="photo-upload-input"
                            type="file"
                        />
                    ) : (
                        <input
                            accept={PHOTO_MIME_TYPES.join(',')}
                            onChange={handleFileInputChange}
                            ref={hiddenPhotoUploadInputRef}
                            className="photo-upload-input"
                            type="file"
                            capture="environment"
                        />
                    )}

                    {/* Render all photos and their metadata */}
                    {photos?.length > 0 && (
                        <div className="photo-gallery">
                            {photos.map((photoData, index) => (
                                <div key={index} className="photo-container">
                                    <Image
                                        src={URL.createObjectURL(
                                            photoData.photo,
                                        )}
                                        thumbnail
                                        className="image-tag"
                                    />
                                    {/* Delete Button */}
                                    <Button
                                        variant="danger"
                                        onClick={event =>
                                            handleDeletePhoto(
                                                event,
                                                photoData?.id,
                                                photoData.photo,
                                            )
                                        }
                                        className="photo-delete-button"
                                    >
                                        <TfiTrash />
                                    </Button>
                                    {/* Metadata */}
                                    <div>
                                        <small>
                                            Timestamp:{' '}
                                            {photoData.metadata?.timestamp ? (
                                                <DateTimeStr
                                                    date={
                                                        photoData.metadata
                                                            ?.timestamp
                                                    }
                                                    source={
                                                        photoData.metadata
                                                            ?.timestampSource
                                                    }
                                                />
                                            ) : (
                                                <span>Missing</span>
                                            )}
                                            <br />
                                            Geolocation:{' '}
                                            {photoData.metadata?.geolocation ? (
                                                <span>
                                                    <GpsCoordStr
                                                        source={
                                                            photoData.metadata
                                                                ?.geolocationSource
                                                        }
                                                        {...photoData.metadata
                                                            ?.geolocation}
                                                    />{' '}
                                                </span>
                                            ) : (
                                                <span>Missing</span>
                                            )}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {loading && (
                        <div className="padding">
                            <div className="loader" />
                        </div>
                    )}
                    {error && <div className="error">{error}</div>}
                    {photos?.length < count && (
                        <div>
                            <Button
                                onClick={handlePhotoGalleryButtonClick}
                                variant="outline-primary"
                            >
                                <TbCameraPlus /> {buttonText}
                            </Button>
                        </div>
                    )}
                    <Modal
                        show={showDeleteConfirmation}
                        onHide={cancelDeletePhoto}
                        dialogClassName="custom-modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Photo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedPhotoBlobToDelete && (
                                <center>
                                    <img
                                        src={URL.createObjectURL(
                                            selectedPhotoBlobToDelete,
                                        )}
                                        alt="Photo preview"
                                        className="modal-image-tag"
                                    />
                                </center>
                            )}
                            <div className="modal-body-text">
                                Are you sure you want to permanently delete this
                                photo? This action cannot be undone.
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={cancelDeletePhoto}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={confirmDeletePhoto}
                            >
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Card.Body>
            </Card>
        </>
    )
}

export default PhotoInput
