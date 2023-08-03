import React, { useState } from 'react'
import type { FC } from 'react'
import { Button, Card, Image, Modal, ModalBody, Popover } from 'react-bootstrap'

import DateTimeStr from './date_time_str'
import GpsCoordStr from './gps_coord_str'
import type PhotoMetadata from '../types/photo_metadata.type'
import { debounce } from 'lodash'
import TextInput from './text_input'

interface PhotoProps {
    description: React.ReactNode
    id: string
    label: string
    metadata: PhotoMetadata
    photo: Blob | undefined
    required: boolean
    deletePhoto?: (id: string) => void
    updateNotes?: (id: string, notes: string) => void
    count?: string
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
const Photo: FC<PhotoProps> = ({
    description,
    label,
    metadata,
    photo,
    required,
    deletePhoto,
    updateNotes,
    id,
    count,
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [notes, setNotes] = useState(metadata.notes || '')
    const handleNotesChange = (input: string) => {
        setNotes(input)
        debounce(() => updateNotes && updateNotes(id, notes), 500)
    }
    return photo || required ? (
        <>
            <Card className="photo-card">
                <Card.Body>
                    <div className="photo-card-header">
                        <Card.Title>{label}</Card.Title> <small>{count}</small>
                    </div>
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
                                {
                                    <span>
                                        <GpsCoordStr
                                            {...metadata.geolocation}
                                        />{' '}
                                    </span>
                                }
                                {(updateNotes || metadata.notes) && (
                                    <TextInput
                                        id="notes"
                                        label="Notes"
                                        value={notes}
                                        updateValue={handleNotesChange}
                                        min={0}
                                        max={280}
                                        regexp={/^[a-zA-Z0-9\s]*$/}
                                    />
                                )}
                                {deletePhoto && (
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        style={{
                                            cursor: 'pointer',
                                            color: 'red',
                                            borderWidth: '1px',
                                            borderRadius: '6px',
                                        }}
                                    >
                                        {' '}
                                        Delete Photo{' '}
                                    </button>
                                )}
                            </small>
                            {deletePhoto && (
                                <Modal show={showDeleteModal}>
                                    <ModalBody>
                                        <p>
                                            Are you sure you want to delete this
                                            photo?
                                        </p>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Button
                                                onClick={() =>
                                                    setShowDeleteModal(false)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    deletePhoto(id)
                                                    setShowDeleteModal(false)
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: 'red',
                                                    borderWidth: '1px',
                                                    borderRadius: '6px',
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </ModalBody>
                                </Modal>
                            )}
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
