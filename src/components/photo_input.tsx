import React, { ChangeEvent, FC, MouseEvent, useEffect, useRef, useState } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import { TfiCamera, TfiGallery } from 'react-icons/tfi'
import Collapsible from './collapsible'
import ImageBlobReduce from 'image-blob-reduce'
import Photo from './photo'
import PhotoMetadata from '../types/photo_metadata.type'


interface PhotoInputProps {
  children: React.ReactNode
  label: string
  photos: {id: string, data: {blob: Blob, metadata: PhotoMetadata}}[]
  upsertPhoto: (file: Blob, id: string) => void
  removeAttachment: (id: string) => void
  id: string
}

const PhotoInput: FC<PhotoInputProps> = ({ children, label, photos, upsertPhoto, removeAttachment, id }) => {
  const hiddenPhotoUploadInputRef = useRef<HTMLInputElement>(null)
  const hiddenCameraInputRef = useRef<HTMLInputElement>(null)
  const photoIds = [photos.map((photo) => photo.id.split('~').pop())]
  const [photoId, setPhotoId] = useState(photoIds.length > 0 ? Math.max(photoIds as any as number) : 0)
  const handlePhotoGalleryButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
    }
    hiddenPhotoUploadInputRef.current && hiddenPhotoUploadInputRef.current.click()
  }

  const handleCameraButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    hiddenCameraInputRef.current && hiddenCameraInputRef.current.click()
  }

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
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

  return (
    <>
      <Card style={{ pageBreakBefore: 'always', marginBottom: '1rem' }}>
        <Card.Body>
          <Collapsible header={label}>
            <Card.Text as="div">{children}</Card.Text>
          </Collapsible>
          <div>
            {(
              <Button onClick={handleCameraButtonClick} variant="outline-primary">
                <TfiCamera /> Camera
              </Button>
            )}
            <Button onClick={handlePhotoGalleryButtonClick} variant="outline-primary">
              <TfiGallery /> Add Photo
            </Button>
          </div>
          <input
            accept="image/jpeg"
            onChange={handleFileInputChange}
            ref={hiddenCameraInputRef}
            style={{ display: 'none' }}
            type="file"
            capture="environment"
          />
          <input
            accept="image/jpeg"
            multiple
            onChange={handleFileInputChange}
            ref={hiddenPhotoUploadInputRef}
            style={{ display: 'none' }}
            type="file"
          />
          {photos.length > 0 && (
            <>
              {photos.map((photo, index) => (
                <div key={index}>
                  <Photo id={photo.id} photo={photo.data.blob} metadata={photo.data.metadata} label='' description='' required={false} deletePhoto={handleFileDelete}/>
                </div>
              ))}
            </>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default PhotoInput
