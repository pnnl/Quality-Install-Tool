import ImageBlobReduce from 'image-blob-reduce'
import {isEmpty} from 'lodash'
import React, {ChangeEvent, FC, MouseEvent, useEffect, useRef, useState} from 'react'
import {Button, Card, Image} from 'react-bootstrap'
import {TfiGallery} from 'react-icons/tfi'

import Collapsible from './collapsible'
import GpsCoordStr from './gps_coord_str'
import PhotoMetaData from '../types/photo_metadata.type'
import uuid from 'react-uuid'

interface Photo {
  id: string
  blob: Blob
  note?: string
}

interface PhotoInputProps {
  id: string,
  children: React.ReactNode
  label: string
  metadata: PhotoMetaData
  photos: [{id: string, photo: Photo }]
  upsertPhoto: (photo: Photo) => void
  deletePhoto: (id: string) => void
  maxPhotos?: number
}

/**
 * Component for photo input
 *
 * @param children Content (most commonly markdown text) describing the photo requirement
 * @param label Label for the photo requirement
 * @param metadata Abbreviated photo metadata including timestamp and geolocation
 * @param photos An array of photos with associated metadata
 * @param upsertPhoto Function used to update/insert a photo into the store
 * @param deletePhoto Function used to delete a photo from the store
 * @param maxPhotos Maximum number of photos that can be added (default: 1)
 */
const PhotoInput: FC<PhotoInputProps> = ({
  id,
  children,
  label,
  photos,
  upsertPhoto,
  deletePhoto,
  maxPhotos = 1,
}) => {
  const handleFileupload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const photo = event.target.files[0]
      const imageBlobReduce = new ImageBlobReduce()
      const blob = await imageBlobReduce.toBlob(photo)
      const id = uuid()
      upsertPhoto({id, blob})

      event.target.value = ''
    }
  }

  const handleNoteChange = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const note = event.target.value
    const photoIndex = photos.findIndex(photo => photo.id === id)
    if (photoIndex >= 0) {
      const updatedPhoto = {...photos[photoIndex], note}
      upsertPhoto(updatedPhoto)
    }
  }
  

  return (
    <>
      <Card style={{pageBreakBefore: 'always', marginBottom: '1rem'}}>
        <Card.Body>
          <Collapsible header={label}>
            {/* Card.Text renders a <p> by default. The children come from markdown
              and may be a <p>. Nested <p>s are not allowed, so we use a <div>*/}
            <Card.Text as="div">{children}</Card.Text>
          </Collapsible>
          {/* Display the photos */}
        {photos.map((photo, index) => (
        <div key={photo.id}>
          {/* keeping blank so that it  */}
          <Image src={} thumbnail style={{ maxWidth: '200px', maxHeight: '200px', marginRight: '1rem' }} />
          <div>
            {/* Input for the note */}
            <Form.Control
              type="text"
              placeholder="Enter a note..."
              value={photo.note}
              onChange={(event) => handleNoteChange(id, event)}
            />
            {/* Delete button */}
            <Button variant="outline-danger" onClick={() => deletePhoto(photo.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
      
      {/* Display the "Add Photo" button if maxPhotos is not reached */}
      {maxPhotos > photos.length && (
        <div>
          <Button onClick={} variant="outline-primary">
            <TfiGallery /> Add Photo
          </Button>
        </div>
      )}
    </Card.Body>
  </Card>
  </>
)
}

export default PhotoInput