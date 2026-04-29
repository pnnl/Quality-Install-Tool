import DateTimeStr from './date_time_str'
import GpsCoordStr from './gps_coord_str'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Image, Modal, Offcanvas } from 'react-bootstrap'
import { TbCameraPlus } from 'react-icons/tb'
import { TfiInfoAlt, TfiTrash } from 'react-icons/tfi'
import StringInputWrapper from './string_input_wrapper'
import TextInputWrapper from './text_input_wrapper'
import { type PhotoAttachment } from '../utilities/photo_attachment_utils'
import { PHOTO_MIME_TYPES } from '../utilities/photo_utils'
import { PhotoQualityWarning } from './photo_quality_warning'

export interface PhotoInputProps {
    children: React.ReactNode
    count: number
    error: string | undefined
    id: string
    label: string
    loading: boolean
    notes?: boolean
    photoNameField?: boolean
    photoNamePath?: string
    photoName?: string
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
    photoNameField = false,
    photoNamePath,
    photoName,
    onPutPhotoAttachment,
    onRemovePhotoAttachment,
    photoAttachments,
    uploadable,
}) => {
    const ref = useRef<HTMLInputElement>(null)
    const hasInfoContent = Boolean(children) || Boolean(label)
    const defaultTip = (
        <>
            <br />
            <b>Photo Tip:</b> To capture the most detail, avoid digital zoom.
            Instead, move closer and frame the shot so the item fills the
            screen. If your phone has multiple cameras/lenses (e.g., 0.5x / 1x /
            2x / 3x), switch lenses to the one that best fills the frame with
            the item while keeping it in focus.
            <br />
            <b>Geolocation Tip:</b> For more reliable GPS data on iPhone, use
            Safari when uploading photos. Chrome on iPhone can be less reliable
            for geolocation and geotagging.
        </>
    )
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
    const handleCloseInfo = () => setShowInfo(false)
    const handleShowInfo = (event: React.MouseEvent) => {
        event.stopPropagation()
        event.preventDefault()
        setShowInfo(true)
    }

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

    return (
        <>
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
                        <center>
                            <img
                                className="modal-image-tag"
                                src={objectURLForDelete}
                                alt="Thumbnail of the photo to delete."
                            />
                        </center>
                    )}
                    <div>
                        Are you sure you want to permanently delete this photo?
                        This action cannot be undone.
                    </div>
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
                    <Button
                        variant="danger"
                        aria-label="Confirm permanent photo deletion"
                        onClick={async () => {
                            if (selectedPhotoAttachmentForDelete) {
                                onRemovePhotoAttachment &&
                                    (await onRemovePhotoAttachment(
                                        selectedPhotoAttachmentForDelete.attachmentId,
                                    ))

                                setSelectedPhotoAttachmentForDelete(undefined)
                            }
                        }}
                    >
                        Permanently Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            {hasInfoContent && (
                <Offcanvas
                    show={showInfo}
                    onHide={handleCloseInfo}
                    placement="end"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>{label}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                    {children}
                    {defaultTip}
                </Offcanvas.Body>
                </Offcanvas>
            )}
            <Card className="input-card photo-input">
                <Card.Body>
                    <div className="photo-input-header mb-3">
                        <h3>{label}</h3>
                        {hasInfoContent && (
                            <button
                                className="info-button"
                                aria-label="Photo Input Information"
                                onClick={handleShowInfo}
                            >
                                <TfiInfoAlt size={20} />
                            </button>
                        )}
                    </div>
                    <input
                        ref={ref}
                        data-testid="photo-input"
                        type="file"
                        accept={PHOTO_MIME_TYPES.join(',')}
                        capture={uploadable ? undefined : 'environment'}
                        className="photo-upload-input"
                        onChange={async event => {
                            if (event.target.files) {
                                const file = event.target.files[0]

                                if (file) {
                                    onPutPhotoAttachment &&
                                        (await onPutPhotoAttachment(file))
                                }
                            }

                            // @note Change detection for `<input type="file" />` elements.
                            //     The "value" attribute is set to the empty
                            //     string to account for the situation when the
                            //     user attempts to import the same JSON
                            //     document more than once without reloading the
                            //     page.
                            //
                            //     If the "value" attribute is not set to the
                            //     empty string, then the second attempt will
                            //     not trigger a change event (because the
                            //     "value" attribute has not changed).
                            event.target.value = ''
                        }}
                    />
                    {photoAttachments.length > 0 && (
                        <div className="photo-gallery">
                            {photoAttachments.map((photoAttachment, index) => (
                                <div key={index} className="photo-container">
                                    {objectURLsForPhotoAttachments?.[index] && (
                                        <Image
                                            className="image-tag"
                                            src={
                                                objectURLsForPhotoAttachments[
                                                    index
                                                ]
                                            }
                                            thumbnail
                                        />
                                    )}
                                    <Button
                                        variant="danger"
                                        className="photo-delete-button"
                                        aria-label="Delete photo"
                                        onClick={event => {
                                            event.stopPropagation()
                                            event.preventDefault()

                                            setSelectedPhotoAttachmentForDelete(
                                                photoAttachment,
                                            )

                                            return false
                                        }}
                                    >
                                        <TfiTrash />
                                    </Button>
                                    <div>
                                        <small>
                                            {photoName && (
                                                <>
                                                    Name: {photoName}
                                                    <br />
                                                </>
                                            )}
                                            Timestamp:{' '}
                                            {photoAttachment.metadata
                                                ?.timestamp ? (
                                                <DateTimeStr
                                                    date={
                                                        photoAttachment.metadata
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
                                                    {...photoAttachment.metadata
                                                        .geolocation}
                                                />
                                            ) : (
                                                <span>Missing</span>
                                            )}
                                            {photoAttachment.metadata
                                                ?.geolocationWarning && (
                                                <>
                                                    <br />
                                                    <span
                                                        style={{ color: 'red' }}
                                                    >
                                                        Location Status:{' '}
                                                        {
                                                            photoAttachment
                                                                .metadata
                                                                .geolocationWarning
                                                        }
                                                    </span>
                                                </>
                                            )}
                                        </small>
                                        <PhotoQualityWarning
                                            attachment={photoAttachment}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {loading && (
                        <div
                            className="photo-upload-status"
                            aria-live="polite"
                            role="status"
                        >
                            <div
                                className="photo-upload-status-spinner"
                                aria-hidden="true"
                            ></div>
                            <div>
                                <strong>Processing photo...</strong>
                                <div>
                                    Processing the image and saving it now.
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="error">Image loading failed.</div>
                    )}
                    {photoNameField && (
                        <StringInputWrapper
                            path={photoNamePath ?? `${id}_photo_name`}
                            label="Name"
                            min={0}
                            max={100}
                            regexp={/.*/}
                            hint=""
                        />
                    )}
                    {photoAttachments.length < count && (
                        <div className="mb-3">
                            <Button
                                variant="outline-primary"
                                onClick={() => ref.current?.click()}
                            >
                                <TbCameraPlus /> Add Photo
                            </Button>
                        </div>
                    )}
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
