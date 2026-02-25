import React, { useEffect, useMemo, useState } from 'react'
import { Card, Col, Image, Row, Offcanvas, Button } from 'react-bootstrap'
import { TfiAlert } from 'react-icons/tfi'

import DateTimeStr from './date_time_str'
import GpsCoordStr from './gps_coord_str'
import { type PhotoAttachment } from '../utilities/photo_attachment_utils'
import { getGeolocationErrorInfo } from '../utilities/photo_utils'

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

    // State for geolocation error offcanvas
    const [geolocationErrorOffcanvas, setGeolocationErrorOffcanvas] = useState<{
        isOpen: boolean
        message: string
        photoIndex: number
        showFaqLink: boolean
        faqTopic?: string
    }>({
        isOpen: false,
        message: '',
        photoIndex: -1,
        showFaqLink: false,
    })

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
            <>
                {/* Geolocation Error Offcanvas */}
                <Offcanvas
                    show={geolocationErrorOffcanvas.isOpen}
                    onHide={() =>
                        setGeolocationErrorOffcanvas(prev => ({
                            ...prev,
                            isOpen: false,
                        }))
                    }
                    placement="end"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                            <TfiAlert
                                className="me-2"
                                style={{ color: '#dc3545' }}
                            />
                            Geolocation Data Missing
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <p>
                            <strong>
                                Photo {geolocationErrorOffcanvas.photoIndex + 1}
                                :
                            </strong>
                        </p>
                        <p style={{ whiteSpace: 'pre-wrap' }}>
                            {geolocationErrorOffcanvas.message}
                        </p>
                        {geolocationErrorOffcanvas.showFaqLink && (
                            <div className="mt-3 p-3 bg-light rounded">
                                <p className="mb-2">
                                    <strong>
                                        Need help enabling location?
                                    </strong>
                                </p>
                                <a
                                    href={`/app/faqs#faq-location-${geolocationErrorOffcanvas.faqTopic}`}
                                    className="btn btn-link p-0"
                                    onClick={e => {
                                        // Allow default link behavior but also log it
                                        console.info(
                                            `[PhotoUpload] User clicked FAQ link for: ${geolocationErrorOffcanvas.faqTopic}`,
                                        )
                                    }}
                                >
                                    View instructions for
                                    {geolocationErrorOffcanvas.faqTopic ===
                                    'mobile'
                                        ? ' Android/iOS'
                                        : ' Desktop'}
                                    &apos; →
                                </a>
                            </div>
                        )}
                    </Offcanvas.Body>
                </Offcanvas>

                <Card className="photo-card">
                    <Card.Body>
                        <Card.Title>{label}</Card.Title>
                        <Card.Text as="div">{description}</Card.Text>
                        {photoAttachments.length > 0 ? (
                            <Row className="photo-row">
                                {photoAttachments.map(
                                    (photoAttachment, index) => {
                                        // Log detailed geolocation errors for report view
                                        const metadata =
                                            photoAttachment.metadata
                                        const hasGeolocation =
                                            metadata?.geolocation?.latitude &&
                                            metadata?.geolocation?.longitude
                                        const geolocationSource =
                                            metadata?.geolocationSource

                                        if (!hasGeolocation) {
                                            if (geolocationSource === 'EXIF') {
                                                // EXIF was found but had no coordinates
                                                console.warn(
                                                    `[Photo] Geolocation missing from EXIF data (Photo ${index + 1}). ` +
                                                        `EXIF data was successfully extracted but contained no GPS coordinates. ` +
                                                        `This typically occurs when: ` +
                                                        `1) Photo was taken without GPS enabled (mobile), ` +
                                                        `2) Location permissions were denied (mobile), ` +
                                                        `3) Photo metadata was stripped before upload (desktop). ` +
                                                        `Fallback to device location also failed.`,
                                                )
                                            } else if (
                                                geolocationSource ===
                                                'navigator.geolocation'
                                            ) {
                                                // Device location was requested but returned nulls
                                                console.warn(
                                                    `[Photo] Device location data missing (Photo ${index + 1}). ` +
                                                        `EXIF extraction found no GPS data. ` +
                                                        `Fallback attempted to retrieve device location but returned empty/null coordinates. ` +
                                                        `This occurs when location services are unavailable or inaccessible.`,
                                                )
                                            } else {
                                                // EXIF extraction completely failed
                                                console.warn(
                                                    `[Photo] Unable to extract EXIF data (Photo ${index + 1}). ` +
                                                        `EXIF extraction failed and device location fallback also failed. ` +
                                                        `Possible causes: ` +
                                                        `1) Photo format does not support EXIF metadata, ` +
                                                        `2) Location permissions not granted (mobile), ` +
                                                        `3) GPS signal unavailable (mobile), ` +
                                                        `4) Browser/privacy settings blocking location (desktop), ` +
                                                        `5) Photo was imported from JSON without geolocation data.`,
                                                )
                                            }
                                        }

                                        return (
                                            <Col key={index}>
                                                <div className="photo-report-container">
                                                    {objectURLs[index] && (
                                                        <Image
                                                            src={
                                                                objectURLs[
                                                                    index
                                                                ]
                                                            }
                                                            thumbnail
                                                        />
                                                    )}
                                                    <div>
                                                        <small>
                                                            Timestamp:{' '}
                                                            {photoAttachment
                                                                .metadata
                                                                ?.timestamp ? (
                                                                <DateTimeStr
                                                                    date={
                                                                        photoAttachment
                                                                            .metadata
                                                                            .timestamp
                                                                    }
                                                                />
                                                            ) : (
                                                                <span>
                                                                    Missing
                                                                </span>
                                                            )}
                                                            <br />
                                                            Geolocation:{' '}
                                                            {photoAttachment
                                                                .metadata
                                                                ?.geolocation
                                                                ?.latitude &&
                                                            photoAttachment
                                                                .metadata
                                                                ?.geolocation
                                                                ?.longitude ? (
                                                                <GpsCoordStr
                                                                    {...photoAttachment
                                                                        .metadata
                                                                        .geolocation}
                                                                />
                                                            ) : (
                                                                <>
                                                                    <span>
                                                                        Missing
                                                                        <Button
                                                                            variant="link"
                                                                            className="p-0 ms-2"
                                                                            style={{
                                                                                fontSize:
                                                                                    'inherit',
                                                                            }}
                                                                            onClick={() => {
                                                                                // Use stored error if available, otherwise derive from source
                                                                                const errorSource =
                                                                                    metadata?.geolocationError ||
                                                                                    metadata?.geolocationSource
                                                                                const errorInfo =
                                                                                    getGeolocationErrorInfo(
                                                                                        errorSource,
                                                                                    )
                                                                                setGeolocationErrorOffcanvas(
                                                                                    {
                                                                                        isOpen: true,
                                                                                        message:
                                                                                            errorInfo.message,
                                                                                        photoIndex:
                                                                                            index,
                                                                                        showFaqLink:
                                                                                            errorInfo.showFaqLink,
                                                                                        faqTopic:
                                                                                            errorInfo.faqTopic,
                                                                                    },
                                                                                )
                                                                            }}
                                                                            title="Click to view error details"
                                                                        >
                                                                            <TfiAlert
                                                                                style={{
                                                                                    color: '#dc3545',
                                                                                }}
                                                                            />
                                                                        </Button>
                                                                    </span>
                                                                </>
                                                            )}
                                                        </small>
                                                    </div>
                                                </div>
                                            </Col>
                                        )
                                    },
                                )}
                            </Row>
                        ) : (
                            required && <em>Missing Photo</em>
                        )}
                        {noteValueLines.length > 0 && (
                            <div className="photo-notes">
                                <h3>Notes:</h3>
                                <div>
                                    {noteValueLines.map(
                                        (noteValueLine, index) => (
                                            <p
                                                key={index}
                                                className="photo-note-string"
                                            >
                                                {noteValueLine}
                                            </p>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </>
        )
    } else {
        return null
    }
}

export default Photo
