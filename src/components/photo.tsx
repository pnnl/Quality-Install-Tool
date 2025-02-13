import React, { useEffect, useMemo, useState } from 'react'
import { Card, Col, Image, Row } from 'react-bootstrap'

import DateTimeStr from './date_time_str'
import GpsCoordStr from './gps_coord_str'
import { type PhotoAttachment } from '../utilities/photo_attachment_utils'

interface PhotoProps {
    description: React.ReactNode
    label: React.ReactNode
    photoAttachments: PhotoAttachment[]
    required: boolean
    noteValue: string | undefined
}

const Photo: React.FC<PhotoProps> = ({
    description,
    label,
    photoAttachments,
    required,
    noteValue,
}) => {
    const noteValueLines = useMemo<string[]>(() => {
        if (noteValue) {
            return noteValue.split(/\r?\n/i)
        } else {
            return []
        }
    }, [noteValue])

    const [objectURLs, setObjectURLs] = useState<string[]>([])

    useEffect(() => {
        const objectURLs = photoAttachments.map(photoAttachment => {
            return URL.createObjectURL(
                (photoAttachment.attachment as PouchDB.Core.FullAttachment)
                    .data as Blob,
            )
        })

        setObjectURLs(objectURLs)

        return () => {
            objectURLs.forEach(objectURL => {
                if (objectURL) {
                    URL.revokeObjectURL(objectURL)
                }
            })
        }
    }, [photoAttachments])

    if (photoAttachments.length > 0 || required) {
        return (
            <Card className="photo-card">
                <Card.Body>
                    <Card.Title>{label}</Card.Title>
                    <Card.Text as="div">{description}</Card.Text>
                    {photoAttachments.length > 0 ? (
                        <Row className="photo-row">
                            {photoAttachments.map((photoAttachment, index) => (
                                <Col key={index}>
                                    <div className="photo-report-container">
                                        {objectURLs[index] && (
                                            <Image
                                                src={objectURLs[index]}
                                                thumbnail
                                            />
                                        )}
                                        <div>
                                            <small>
                                                Timestamp:{' '}
                                                {photoAttachment.metadata
                                                    ?.timestamp ? (
                                                    <DateTimeStr
                                                        date={
                                                            photoAttachment
                                                                .metadata
                                                                .timestamp
                                                        }
                                                    />
                                                ) : (
                                                    <span>Missing</span>
                                                )}
                                                <br />
                                                Geolocation:{' '}
                                                {photoAttachment.metadata
                                                    ?.geolocation ? (
                                                    <GpsCoordStr
                                                        {...photoAttachment
                                                            .metadata
                                                            .geolocation}
                                                    />
                                                ) : (
                                                    <span>Missing</span>
                                                )}
                                            </small>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        required && <em>Missing Photo</em>
                    )}
                    {noteValueLines.length > 0 && (
                        <div className="photo-notes">
                            <h3>Notes:</h3>
                            <div>
                                {noteValueLines.map(noteValueLine => (
                                    <p className="photo-note-string">
                                        {noteValueLine}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>
        )
    } else {
        return null
    }
}

export default Photo
