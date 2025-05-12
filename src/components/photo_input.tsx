import PouchDB from 'pouchdb'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Image, Modal } from 'react-bootstrap'
import { TbCameraPlus } from 'react-icons/tb'
import { TfiTrash } from 'react-icons/tfi'

import Collapsible from './collapsible'
import DateTimeStr from './date_time_str'
import GpsCoordStr from './gps_coord_str'
import TextInputWrapper from './text_input_wrapper'
import { type PhotoAttachment } from '../utilities/photo_attachment_utils'
import { PHOTO_MIME_TYPES } from '../utilities/photo_utils'

export interface PhotoInputProps {
    label: string
    uploadable: boolean
    loading: boolean
    error: string | undefined
    count: number
    id: string
    notes?: boolean
    photoAttachments: PhotoAttachment[]
    onPutPhotoAttachment?: (file: Blob) => Promise<void>
    onRemovePhotoAttachment?: (
        attachmentId: PouchDB.Core.AttachmentId,
    ) => Promise<void>
    children: React.ReactNode
}

const PhotoInput: React.FC<PhotoInputProps> = ({
    label,
    uploadable,
    loading,
    error,
    count,
    id,
    notes = true,
    photoAttachments,
    onPutPhotoAttachment,
    onRemovePhotoAttachment,
    children,
}) => {
    const ref = useRef<HTMLInputElement>(null)

    const [objectURLForDelete, setObjectURLForDelete] = useState<
        string | undefined
    >(undefined)
    const [objectURLsForPhotoAttachments, setObjectURLsForPhotoAttachments] =
        useState<string[] | undefined>(undefined)
    const [
        selectedPhotoAttachmentForDelete,
        setSelectedPhotoAttachmentForDelete,
    ] = useState<PhotoAttachment | undefined>(undefined)

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
            <Card className="input-card">
                <Card.Body>
                    <Collapsible header={label}>
                        <Card.Text as="div">{children}</Card.Text>
                    </Collapsible>
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
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {loading && (
                        <div className="padding">
                            <div className="loader"></div>
                        </div>
                    )}
                    {error && (
                        <div className="error">Image loading failed.</div>
                    )}
                    {photoAttachments.length < count && (
                        <div className="pb-2">
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
                            label="Optional note about photo(s):"
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
