import {isEmpty} from 'lodash'
import React, {FC, useEffect, useState} from 'react'
import {Button, Card, Image} from 'react-bootstrap'


import GpsCoordStr from './gps_coord_str'
import PhotoMetadata from '../types/photo_metadata.type'

interface PhotoProps {
  description: React.ReactNode,
  id: string,
  label: string,
  metadata: PhotoMetadata,
  photo: Blob | undefined,
  required: boolean,
}

/**
 * A component that displays a photo, timestamp, geolocation, label, and description
 *
 * @param description Content (most commonly markdown text) used to describe the photo
 * @param label Label for the component
 * @param metadata Photo metadata including timestamp and geolocation
 * @param notes User notes associated with the photo
 * @param photo A Blob for the photo image
 * @param required When unset, the Photo component will only show if there is a
 * photo attachement in the data store with the given id. When set, the Photo component
 * will always show and the Photo component will indicate when the photo is missing.
 */
const Photo: FC<PhotoProps> = ({description, label, metadata, photo, required}) => {

  return (photo || required)? (
    <>
      <Card style={{breakInside: 'avoid-page', marginBottom: '1rem', marginTop: '1rem'}}>
        <Card.Body>
          <Card.Title>{label}</Card.Title>
          {/* Card.Text renders a <p> by defult. The description comes from markdown
            and may be a <p>. Nested <p>s are not allowed, so we use a <div>*/}
          <Card.Text as="div">
            {description}
          </Card.Text>
          {photo? (
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
                  metadata?.geolocation?.latitude  && metadata?.geolocation?.latitude?.deg.toString() !== 'NaN' &&
                  metadata?.geolocation?.longitude && metadata?.geolocation?.longitude?.deg.toString() !== 'NaN' ?
                  <span><GpsCoordStr {...metadata.geolocation.latitude} />  <GpsCoordStr {...metadata.geolocation.longitude} /></span> :
                  <span>Missing</span>
                }
              </small>
            </>
          ) : required && (
            <em>Missing Photo</em>
          )
        }
        </Card.Body>
      </Card>
    </>
  ) : null;
};

export default Photo
