import React from 'react'
import type { FC } from 'react'
import { Card, Image, Row, Col } from 'react-bootstrap'

import DateTimeStr from './date_time_str'
import GpsCoordStr from './gps_coord_str'
import type PhotoMetadata from '../types/photo_metadata.type'

interface PhotoProps {
    description: React.ReactNode
    label: string
    photos: { id: string; photo: Blob; metadata: PhotoMetadata }[] // Array of photo objects with metadata
    required: boolean
    noteValue: string | undefined
}
/**
 * A component that displays a photo, timestamp, geolocation, label, and description
 * Displays multiple photos (2 per row) with metadata in a grid layout
 *
 * @param description Content (most commonly markdown text) used to describe the photo
 * @param label Label for the component
 * @param metadata Photo metadata including timestamp and geolocation
 * @param photos Array of photo objects with photo Blob and metadata for each photo
 *         {
 *         id attachment id for the photo and metadata
 *         photo A Blob for the photo image
 *         metadata Photo metadata including timestamp and geolocation
 *         }[]
 * @param required When unset, the Photo component will only show if there is a
 * photo attachment in the data store with the given id. When set, the Photo component
 * will always show and the Photo component will indicate when the photo is missing.
 * @param noteValue The value to be displayed as the note for the photos
 */
const Photo: FC<PhotoProps> = ({
    description,
    label,
    photos,
    required,
    noteValue,
}) => {
    return (photos && photos.length > 0) || required ? (
        <Card className="photo-card">
            <Card.Body>
                <Card.Title>{label}</Card.Title>
                <Card.Text as="div">{description}</Card.Text>
                {noteValue && (
                    <div className="photo-notes">
                        <h3>Notes: </h3>
                        <div>{noteValue ? noteValue : null}</div>
                    </div>
                )}

                {photos && photos.length > 0
                    ? Array.isArray(photos) && (
                          <Row className="photo-row">
                              {photos.map(photoData => (
                                  <Col key={photoData.id}>
                                      {photoData.photo ? (
                                          <div className="photo-report-container">
                                              <Image
                                                  src={URL.createObjectURL(
                                                      photoData.photo,
                                                  )}
                                                  thumbnail
                                              />
                                              <div>
                                                  <small>
                                                      Timestamp:{' '}
                                                      {photoData.metadata
                                                          ?.timestamp ? (
                                                          <DateTimeStr
                                                              date={
                                                                  photoData
                                                                      .metadata
                                                                      .timestamp
                                                              }
                                                              source={
                                                                  photoData
                                                                      .metadata
                                                                      .timestampSource
                                                              }
                                                          />
                                                      ) : (
                                                          <span>Missing</span>
                                                      )}
                                                      <br />
                                                      Geolocation:{' '}
                                                      {photoData.metadata
                                                          ?.geolocation ? (
                                                          <span>
                                                              <GpsCoordStr
                                                                  source={
                                                                      photoData
                                                                          .metadata
                                                                          .geolocationSource
                                                                  }
                                                                  {...photoData
                                                                      .metadata
                                                                      .geolocation}
                                                              />{' '}
                                                          </span>
                                                      ) : (
                                                          <span>Missing</span>
                                                      )}
                                                  </small>
                                              </div>
                                          </div>
                                      ) : null}
                                  </Col>
                              ))}
                          </Row>
                      )
                    : required && <em>Missing Photo</em>}
            </Card.Body>
        </Card>
    ) : null
}

export default Photo
