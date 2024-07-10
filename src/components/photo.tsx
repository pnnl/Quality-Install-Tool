import React from 'react'
import type { FC } from 'react'
import { Card, Image } from 'react-bootstrap'

import DateTimeStr from './date_time_str'
import GpsCoordStr from './gps_coord_str'
import type PhotoMetadata from '../types/photo_metadata.type'

interface PhotoProps {
    description: React.ReactNode
    id: string
    label: string
    metadata: PhotoMetadata
    photo: Blob | undefined
    required: boolean
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
 * photo attachment in the data store with the given id. When set, the Photo component
 * will always show and the Photo component will indicate when the photo is missing.
 */
const Photo: FC<PhotoProps> = ({
    description,
    label,
    metadata,
    photo,
    required,
}) => {
    return photo || required ? (
        <>
            <Card className="photo-card">
                <Card.Body>
                    <Card.Title>{label}</Card.Title>
                    {/* Card.Text renders a <p> by defult. The description comes from markdown
            and may be a <p>. Nested <p>s are not allowed, so we use a <div>*/}
                    <Card.Text as="div">{description}</Card.Text>
                    {photo ? (
                        <>
                            <Image src={URL.createObjectURL(photo)} thumbnail />
                            <br />
                            <small>
                                Timestamp:{' '}
                                {metadata?.timestamp ? (
                                    <DateTimeStr date={metadata.timestamp} />
                                ) : (
                                    <span>Missing</span>
                                )}
                                <br />
                                Geolocation:{' '}
                                {metadata?.geolocation ? (
                                    <span>
                                        <GpsCoordStr
                                            {...metadata.geolocation}
                                        />{' '}
                                    </span>
                                ) : (
                                    <span>Missing</span>
                                )}
                            </small>
                        </>
                    ) : (
                        required && <em>Missing Photo</em>
                    )}
                </Card.Body>
            </Card>
        </>
    ) : null
}

export default Photo
