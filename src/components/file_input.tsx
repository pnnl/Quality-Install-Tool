import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import Collapsible from './collapsible'

interface FileInputProps {
    children: React.ReactNode
    label: string
   file: Blob | undefined
    upsertPhoto: (file: Blob) => void
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
const FileInput: FC<FileInputProps> = ({
    children,
    label,
    file,
    upsertFile,
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

   
    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0]
            upsertFile(file)
        }
    }

    // Check if there is already a photo
    const hasPhoto = !!file

    // Button text based on whether there is a photo or not
    const buttonText = hasPhoto ? 'Replace File' : 'Add File'

    return (
        <>
            <Card className="input-card">
                <Card.Body>
                        
                    <Card.Text as="div">{children}</Card.Text>
                    <div>
                        <Button
                            onClick={handlePhotoGalleryButtonClick}
                            variant="outline-primary">{buttonText}
                        </Button>
                    </div>
                    
                    <input
                        accept="application/pdf, application/vnd.ms-excel"
                        onChange={handleFileInputChange}
                        ref={hiddenPhotoUploadInputRef}
                        className="photo-upload-input"
                        type="file"
                        capture="environment"
                    />
                    {photo && (
                        <>
                            <a href={URL.createObjectURL(photo)}>{}</a>
                        </>
                    )}
                </Card.Body>
            </Card>
        </>
    )
}

export default FileInput
