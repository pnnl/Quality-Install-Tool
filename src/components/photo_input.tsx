import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import { TbCameraPlus } from 'react-icons/tb'

import Collapsible from './collapsible'
import DateTimeStr from './date_time_str'
import GpsCoordStr from './gps_coord_str'
import type PhotoMetaData from '../types/photo_metadata.type'
import { PHOTO_MIME_TYPES } from '../utilities/photo_utils'

interface PhotoInputProps {
    children: React.ReactNode
    label: string
    metadata: PhotoMetaData
    photo: Blob | undefined
    upsertPhoto: (file: Blob) => void
    uploadable: boolean
    loading: boolean
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
    photo,
    upsertPhoto,
    uploadable,
    loading,
}) => {
    // Create references to the hidden file inputs
    const hiddenPhotoCaptureInputRef = useRef<HTMLInputElement>(null)
    const hiddenPhotoUploadInputRef = useRef<HTMLInputElement>(null)

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
            navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
                setCameraAvailable(true)
            })
        }
    })

    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0]
            upsertPhoto(file)
        }
    }

    // Check if there is already a photo
    const hasPhoto = !!photo

    // Button text based on whether there is a photo or not
    const buttonText = hasPhoto ? 'Replace Photo' : 'Add Photo'
    return (
        <>
            <Card className="input-card">
                <Card.Body>
                    <Collapsible header={label}>
                        {/* Card.Text renders a <p> by defult. The children come from markdown
              and may be a <p>. Nested <p>s are not allowed, so we use a <div>*/}
                        <Card.Text as="div">{children}</Card.Text>
                    </Collapsible>
                    <div>
                        {/* {(cameraAvailable || cameraAvailable) &&
              <Button onClick={handlePhotoCaptureButtonClick}
              variant="outline-primary">
              <TfiCamera/> Camera</Button>
            } */}
                        <Button
                            onClick={handlePhotoGalleryButtonClick}
                            variant="outline-primary"
                        >
                            <TbCameraPlus /> {buttonText}{' '}
                        </Button>
                    </div>
                    {/* <input
                            accept={PHOTO_MIME_TYPES.join(',')}
                            capture="environment"
                            onChange={handleFileInputChange}
                            ref={hiddenPhotoCaptureInputRef}
                            className='photo-input'
                            type="file"
                        /> */}
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
                    {loading && (
                        <div className="padding">
                            <div className="loader" />
                        </div>
                    )}
                    {photo && (
                        <>
                            <Image src={URL.createObjectURL(photo)} thumbnail />
                            <br />
                            <small>
                                Timestamp:{' '}
                                {metadata?.timestamp ? (
                                    <DateTimeStr
                                        date={metadata.timestamp}
                                        source={metadata.timestampSource}
                                    />
                                ) : (
                                    <span>Missing</span>
                                )}
                                <br />
                                Geolocation:{' '}
                                {metadata?.geolocation ? (
                                    <span>
                                        <GpsCoordStr
                                            source={metadata.geolocationSource}
                                            {...metadata.geolocation}
                                        />{' '}
                                    </span>
                                ) : (
                                    <span>Missing</span>
                                )}
                            </small>
                        </>
                    )}
                </Card.Body>
            </Card>
        </>
    )
}

export default PhotoInput
