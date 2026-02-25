import DateTimeStr from './date_time_str'
import GpsCoordStr from './gps_coord_str'
import React, { useEffect, useRef, useState } from 'react'
import {
    Button,
    Card,
    Image,
    Modal,
    Offcanvas,
    Alert,
    Spinner,
} from 'react-bootstrap'
import { TbCameraPlus } from 'react-icons/tb'
import { TfiInfoAlt, TfiTrash, TfiAlert } from 'react-icons/tfi'
import TextInputWrapper from './text_input_wrapper'
import { type PhotoAttachment } from '../utilities/photo_attachment_utils'
import {
    PHOTO_MIME_TYPES,
    isPhoto,
    getGeolocationErrorInfo,
} from '../utilities/photo_utils'
import { getDeviceType } from '../utilities/device_detection_utils'

export interface PhotoInputProps {
    children: React.ReactNode
    count: number
    error: string | undefined
    id: string
    label: string
    loading: boolean
    notes?: boolean
    onPutPhotoAttachment?: (file: Blob) => Promise<void>
    onRemovePhotoAttachment?: (
        attachmentId: PouchDB.Core.AttachmentId,
    ) => Promise<void>
    photoAttachments: PhotoAttachment[]
    uploadable: boolean
}

const PhotoInput: React.FC<PhotoInputProps> = ({
    children,
    count,
    error,
    id,
    label,
    loading,
    notes = true,
    onPutPhotoAttachment,
    onRemovePhotoAttachment,
    photoAttachments,
    uploadable,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    // State for managing photo-related operations
    const [objectURLForDelete, setObjectURLForDelete] = useState<
        string | undefined
    >(undefined)
    const [objectURLsForPhotoAttachments, setObjectURLsForPhotoAttachments] =
        useState<string[] | undefined>(undefined)
    const [
        selectedPhotoAttachmentForDelete,
        setSelectedPhotoAttachmentForDelete,
    ] = useState<PhotoAttachment | undefined>(undefined)
    const [showInfo, setShowInfo] = useState(false)

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

    // Enhanced error state for more detailed feedback
    const [uploadError, setUploadError] = useState<{
        message?: string
        type?: 'validation' | 'upload'
    }>({})

    // File change handler
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        // Reset previous errors
        setUploadError({})

        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]

            // Validate file type
            if (!isPhoto(file)) {
                setUploadError({
                    message: `Unsupported file type. Allowed types: ${PHOTO_MIME_TYPES.join(', ')}`,
                    type: 'validation',
                })
                return
            }

            try {
                // Upload the photo
                if (onPutPhotoAttachment) {
                    await onPutPhotoAttachment(file)
                }
            } catch (error) {
                console.error('Photo upload error:', error)
                setUploadError({
                    message:
                        error instanceof Error
                            ? `Upload failed: ${error.message}`
                            : 'Failed to upload photo',
                    type: 'upload',
                })
            } finally {
                // Reset input value to allow re-uploading same file
                event.target.value = ''
            }
        }
    }

    // Effect for managing delete preview URL
    useEffect(() => {
        const objectURL = selectedPhotoAttachmentForDelete
            ? URL.createObjectURL(
                  (
                      selectedPhotoAttachmentForDelete.attachment as PouchDB.Core.FullAttachment
                  ).data as Blob,
              )
            : undefined
        setObjectURLForDelete(objectURL)
        return () => {
            if (objectURL) {
                URL.revokeObjectURL(objectURL)
            }
        }
    }, [selectedPhotoAttachmentForDelete])

    // Effect for managing photo attachment preview URLs
    useEffect(() => {
        const objectURLs = photoAttachments.map(photoAttachment => {
            return URL.createObjectURL(
                (photoAttachment.attachment as PouchDB.Core.FullAttachment)
                    .data as Blob,
            )
        })
        setObjectURLsForPhotoAttachments(objectURLs)
        return () => {
            objectURLs.forEach(objectURL => {
                if (objectURL) {
                    URL.revokeObjectURL(objectURL)
                }
            })
        }
    }, [photoAttachments])

    // Photo deletion handler
    const handlePhotoDelete = async () => {
        if (selectedPhotoAttachmentForDelete && onRemovePhotoAttachment) {
            await onRemovePhotoAttachment(
                selectedPhotoAttachmentForDelete.attachmentId,
            )
            setSelectedPhotoAttachmentForDelete(undefined)
        }
    }

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
                            Photo {geolocationErrorOffcanvas.photoIndex + 1}:
                        </strong>
                    </p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>
                        {geolocationErrorOffcanvas.message}
                    </p>
                    {geolocationErrorOffcanvas.showFaqLink && (
                        <div className="mt-3 p-3 bg-light rounded">
                            <p className="mb-2">
                                <strong>Need help enabling location?</strong>
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
                                View instructions for{' '}
                                {geolocationErrorOffcanvas.faqTopic === 'mobile'
                                    ? 'Android/iOS'
                                    : 'Desktop'}
                                &apos; → &apos;
                            </a>
                        </div>
                    )}
                </Offcanvas.Body>
            </Offcanvas>

            {/* Delete Confirmation Modal */}
            <Modal
                dialogClassName="custom-modal"
                show={selectedPhotoAttachmentForDelete !== undefined}
                onHide={() => setSelectedPhotoAttachmentForDelete(undefined)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete Photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {objectURLForDelete && (
                        <div className="text-center mb-3">
                            <img
                                className="modal-image-tag img-fluid"
                                src={objectURLForDelete}
                                alt="Thumbnail of the photo to delete."
                            />
                        </div>
                    )}
                    <p>
                        Are you sure you want to permanently delete this photo?
                        This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() =>
                            setSelectedPhotoAttachmentForDelete(undefined)
                        }
                    >
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handlePhotoDelete}>
                        Permanently Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Info Offcanvas */}
            <Offcanvas
                show={showInfo}
                onHide={() => setShowInfo(false)}
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{label}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>{children}</Offcanvas.Body>
            </Offcanvas>

            {/* Main Photo Input Card */}
            <Card className="input-card photo-input">
                <Card.Body>
                    {/* Header */}
                    <div className="photo-input-header d-flex justify-content-between align-items-center mb-3">
                        <h3>{label}</h3>
                        <Button
                            variant="link"
                            className="p-0"
                            onClick={() => setShowInfo(true)}
                            aria-label="Show information"
                        >
                            <TfiInfoAlt size={20} />
                        </Button>
                    </div>

                    {/* Error Handling */}
                    {(uploadError.message || error) && (
                        <Alert
                            variant="danger"
                            onClose={() => setUploadError({})}
                            dismissible
                        >
                            {uploadError.message || error}
                        </Alert>
                    )}

                    {/* File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={PHOTO_MIME_TYPES.join(',')}
                        capture={uploadable ? undefined : 'environment'}
                        className="d-none"
                        onChange={handleFileChange}
                    />

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="text-center my-3">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </Spinner>
                            <p className="mt-2 text-muted">
                                Processing photo...
                            </p>
                        </div>
                    )}

                    {/* Photo Gallery */}
                    {photoAttachments.length > 0 && (
                        <div className="photo-gallery row g-2">
                            {photoAttachments.map((photoAttachment, index) => {
                                // Log detailed geolocation errors
                                const metadata = photoAttachment.metadata
                                const hasGeolocation =
                                    metadata?.geolocation?.latitude &&
                                    metadata?.geolocation?.longitude
                                const geolocationSource =
                                    metadata?.geolocationSource

                                if (!hasGeolocation) {
                                    const deviceType =
                                        getDeviceType() === 'mobile'
                                            ? 'Mobile (Android/iOS)'
                                            : 'Desktop'

                                    if (geolocationSource === 'EXIF') {
                                        // EXIF was found but had no coordinates
                                        console.warn(
                                            `[PhotoInput] Geolocation missing from EXIF data (Photo ${index + 1}). ` +
                                                `EXIF data was extracted but contained no GPS coordinates. ` +
                                                `For mobile (${deviceType}), GPS data may not be embedded in the photo. ` +
                                                `Attempted fallback to device location, but fallback also failed.`,
                                        )
                                    } else if (
                                        geolocationSource ===
                                        'navigator.geolocation'
                                    ) {
                                        // Device location was requested but returned nulls
                                        console.warn(
                                            `[PhotoInput] Device location data missing (Photo ${index + 1}). ` +
                                                `EXIF extraction found no GPS data. ` +
                                                `Attempted to retrieve location from device (${deviceType}), ` +
                                                `but device returned null/empty coordinates.`,
                                        )
                                    } else {
                                        // EXIF extraction completely failed
                                        console.warn(
                                            `[PhotoInput] Unable to extract EXIF data (Photo ${index + 1}). ` +
                                                `EXIF extraction failed on device (${deviceType}). ` +
                                                `Attempted to retrieve location from device, but also failed. ` +
                                                `Possible causes: ` +
                                                `1) Photo format does not support EXIF, ` +
                                                `2) Location permissions not granted (mobile), ` +
                                                `3) GPS hardware/signal unavailable (mobile), ` +
                                                `4) Browser/privacy settings blocking location access (desktop).`,
                                        )
                                    }
                                }

                                return (
                                    <div
                                        key={index}
                                        className="col-4 position-relative"
                                    >
                                        {objectURLsForPhotoAttachments?.[
                                            index
                                        ] && (
                                            <Image
                                                src={
                                                    objectURLsForPhotoAttachments[
                                                        index
                                                    ]
                                                }
                                                thumbnail
                                                className="w-100"
                                            />
                                        )}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="position-absolute top-0 end-0 m-1"
                                            onClick={() =>
                                                setSelectedPhotoAttachmentForDelete(
                                                    photoAttachment,
                                                )
                                            }
                                        >
                                            <TfiTrash />
                                        </Button>
                                        <div className="mt-1">
                                            <small>
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
                                                    ?.geolocation?.latitude &&
                                                photoAttachment.metadata
                                                    ?.geolocation?.longitude ? (
                                                    <GpsCoordStr
                                                        {...photoAttachment
                                                            .metadata
                                                            .geolocation}
                                                    />
                                                ) : (
                                                    <>
                                                        <span>Missing</span>
                                                        <Button
                                                            variant="link"
                                                            className="p-0 ms-2"
                                                            style={{
                                                                fontSize:
                                                                    'inherit',
                                                            }}
                                                            onClick={() => {
                                                                const errorInfo =
                                                                    getGeolocationErrorInfo(
                                                                        metadata?.geolocationSource,
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
                                                    </>
                                                )}
                                            </small>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Add Photo Button */}
                    {photoAttachments.length < count && (
                        <div className="mt-3">
                            <Button
                                variant="outline-primary"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                            >
                                <TbCameraPlus className="me-2" /> Add Photo
                            </Button>
                        </div>
                    )}

                    {/* Optional Notes Input */}
                    {notes && (
                        <TextInputWrapper
                            path={`${id}_note`}
                            label="Notes"
                            min={0}
                            max={300}
                            regexp={/.*/}
                        />
                    )}
                </Card.Body>
            </Card>
        </>
    )
}

export default PhotoInput
