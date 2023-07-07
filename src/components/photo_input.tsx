import ImageBlobReduce from 'image-blob-reduce'
import {isEmpty} from 'lodash'
import React, {ChangeEvent, FC, MouseEvent, useEffect, useRef, useState} from 'react'
import {Button, Card, Image} from 'react-bootstrap'
import {TfiGallery} from 'react-icons/tfi'
 

import Collapsible from './collapsible'
import GpsCoordStr from './gps_coord_str'
import PhotoMetaData from '../types/photo_metadata.type'

interface PhotoInputProps {
  children: React.ReactNode,
  label: string,
  metadata: PhotoMetaData,
  photo: Blob | undefined,
  upsertPhoto: (file: Blob) => void,
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
const PhotoInput: FC<PhotoInputProps> = ({children, label, metadata, photo, upsertPhoto}) => {
  // Create references to the hidden file inputs
  const hiddenPhotoCaptureInputRef = useRef<HTMLInputElement>(null)
  const hiddenPhotoUploadInputRef = useRef<HTMLInputElement>(null)

  const [cameraAvailable, setCameraAvailable] = useState(false)

  // Handle button clicks
  const handlePhotoCaptureButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    hiddenPhotoCaptureInputRef.current && hiddenPhotoCaptureInputRef.current.click()
  }
  const handlePhotoGalleryButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    hiddenPhotoUploadInputRef.current && hiddenPhotoUploadInputRef.current.click()
  }

  useEffect(() => {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setCameraAvailable(true)
      });
    }

  })



  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      upsertPhoto(file)
    }
  }

  return (
    <>
      <Card style={{pageBreakBefore: 'always', marginBottom: '1rem'}}>
        <Card.Body>
          <Collapsible header={label}>
            {/* Card.Text renders a <p> by defult. The children come from markdown
              and may be a <p>. Nested <p>s are not allowed, so we use a <div>*/}
            <Card.Text as="div">
              {children}
            </Card.Text>
          </Collapsible>
          <div>
            {/* {(cameraAvailable || cameraAvailable) &&
              <Button onClick={handlePhotoCaptureButtonClick}
              variant="outline-primary">
              <TfiCamera/> Camera</Button>
            } */}
            <Button onClick={handlePhotoGalleryButtonClick}
              variant="outline-primary"><TfiGallery/> Add Photo</Button>
          </div>
          {/* <input
            accept="image/jpeg"
            capture="environment"
            onChange={handleFileInputChange}
            ref={hiddenPhotoCaptureInputRef}
            style={{display: 'none'}}
            type="file"
          /> */}
          <input
            accept="image/jpeg"
            onChange={handleFileInputChange}
            ref={hiddenPhotoUploadInputRef}
            style={{display: 'none'}}
            type="file" capture="environment"
          />
          {photo && (
            <>
              <Image src={URL.createObjectURL(photo)} thumbnail />
              <br />
              <small>
                Timestamp: {
                  metadata?.timestamp ? (<span>{metadata.timestamp}</span>) :
                  (<span>Missing</span>)
                }
                <br />
                Geolocation: {
                  <span><GpsCoordStr {...metadata.geolocation} />  </span>
                }
              </small>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default PhotoInput
