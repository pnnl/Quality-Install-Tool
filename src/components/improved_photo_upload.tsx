import React, { useRef, useState } from 'react'
import { getPhotoMetadata, compressPhoto } from '../utilities/photo_utils'
import { PhotoQualityWarning } from './photo_quality_warning'
import { Modal, Button, Offcanvas } from 'react-bootstrap'

// Type for photo status
type PhotoStatus = 'valid' | 'warning' | 'error'

// Type for uploaded photo
interface UploadedPhoto {
    id: string
    file: File
    url: string
    status: PhotoStatus
    metadata?: any
    warning?: string
}

/**
 * ImprovedPhotoUpload
 *
 * A modern, accessible photo upload component with drag-and-drop, gallery, progress, and camera capture support.
 *
 * Features:
 * - Drag-and-drop and file input for photo upload
 * - Responsive gallery grid with photo cards
 * - Each card: thumbnail, status badge, replace/remove, inline warning/error
 * - Progress bar and action buttons
 * - Uses Bootstrap classes for layout
 * - Uses utility functions (getPhotoMetadata, compressPhoto)
 * - Uses PhotoQualityWarning for warnings/errors
 * - Camera capture support: On mobile devices, the file input uses the 'capture' attribute to prompt the device camera. Users can take a photo directly or select from their gallery.
 *
 * Usage:
 *   <ImprovedPhotoUpload />
 */
const ImprovedPhotoUpload: React.FC = () => {
    const [photos, setPhotos] = useState<UploadedPhoto[]>([])
    const [dragActive, setDragActive] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [selectedPhotoForDelete, setSelectedPhotoForDelete] =
        useState<UploadedPhoto | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Info message and actionable tips
    const infoTip = (
        <>
            <b>Photo Tips:</b>
            <ul>
                <li>
                    Use your device camera for best results (tap or drag here on
                    mobile).
                </li>
                <li>Avoid digital zoom; move closer to the subject.</li>
                <li>Ensure good lighting and keep the camera steady.</li>
                <li>Frame the item so it fills the screen and is in focus.</li>
                <li>Switch camera lenses if available for better framing.</li>
            </ul>
            <b>Clarity Issues:</b>
            <ul>
                <li>
                    Warnings will appear below each photo if clarity, GPS, or
                    timestamp issues are detected.
                </li>
                <li>Click the info button for more guidance.</li>
            </ul>
        </>
    )

    // Handle file selection
    const handleFiles = async (files: FileList | null) => {
        if (!files) return
        const newPhotos: UploadedPhoto[] = []
        for (const file of Array.from(files)) {
            const url = URL.createObjectURL(file)
            let metadata,
                status: PhotoStatus = 'valid',
                warning = ''
            try {
                metadata = await getPhotoMetadata(file)
                // Add your own validation logic here
            } catch (e) {
                status = 'warning'
                warning = 'Could not extract metadata'
            }
            newPhotos.push({
                id: `${file.name}-${Date.now()}`,
                file,
                url,
                status,
                metadata,
                warning,
            })
        }
        setPhotos(prev => [...prev, ...newPhotos])
    }

    // Drag and drop handlers
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)
        handleFiles(e.dataTransfer.files)
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(true)
    }

    const onDragLeave = () => setDragActive(false)

    // Remove photo
    const removePhoto = (id: string) => {
        setPhotos(prev => prev.filter(photo => photo.id !== id))
    }

    // Replace photo (simplified: just removes for now)
    const replacePhoto = (id: string) => {
        removePhoto(id)
        fileInputRef.current?.click()
    }

    // Progress
    const requiredPhotos = 5
    const progress = Math.min((photos.length / requiredPhotos) * 100, 100)

    return (
        <div className="photo-upload-container">
            <header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <h2>Upload Installation Photos</h2>
                    <p>
                        Attach clear photos for each required step. GPS and
                        timestamp will be recorded.
                    </p>
                </div>
                <button
                    className="info-button"
                    aria-label="Photo Input Information"
                    onClick={() => setShowInfo(true)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    ℹ️
                </button>
            </header>

            <Offcanvas
                show={showInfo}
                onHide={() => setShowInfo(false)}
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Photo Upload Tips</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>{infoTip}</Offcanvas.Body>
            </Offcanvas>

            <section
                className={`upload-area${dragActive ? ' drag-active' : ''}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    border: '2px dashed #aaa',
                    padding: 24,
                    cursor: 'pointer',
                    marginBottom: 24,
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    capture
                    multiple
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={e => handleFiles(e.target.files)}
                />
                <span>
                    Drag &amp; drop photos here, click to select, or use your
                    device camera
                </span>
            </section>

            <section
                className="photo-gallery"
                style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
            >
                {photos.map(photo => (
                    <div
                        key={photo.id}
                        className="photo-card"
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            padding: 8,
                            width: 200,
                            position: 'relative',
                        }}
                    >
                        <img
                            src={photo.url}
                            alt="thumbnail"
                            style={{ width: '100%', borderRadius: 4 }}
                        />
                        <span
                            className={`badge badge-${photo.status}`}
                            style={{ position: 'absolute', top: 8, right: 8 }}
                        >
                            {photo.status.charAt(0).toUpperCase() +
                                photo.status.slice(1)}
                        </span>
                        <button
                            onClick={() => replacePhoto(photo.id)}
                            style={{ marginTop: 8 }}
                        >
                            Replace
                        </button>
                        <button
                            onClick={() => setSelectedPhotoForDelete(photo)}
                            style={{ marginLeft: 8 }}
                        >
                            Remove
                        </button>
                        <div style={{ marginTop: 8 }}>
                            <small>
                                <b>Timestamp:</b>{' '}
                                {photo.metadata?.timestamp ? (
                                    photo.metadata.timestamp
                                ) : (
                                    <span>Missing</span>
                                )}
                                <br />
                                <b>Geolocation:</b>{' '}
                                {photo.metadata?.geolocation ? (
                                    `${photo.metadata.geolocation.latitude}, ${photo.metadata.geolocation.longitude}`
                                ) : (
                                    <span>Missing</span>
                                )}
                                {photo.metadata?.geolocationWarning && (
                                    <>
                                        <br />
                                        <span style={{ color: 'red' }}>
                                            Location Status:{' '}
                                            {photo.metadata.geolocationWarning}
                                        </span>
                                    </>
                                )}
                            </small>
                            {photo.warning && (
                                <div style={{ color: 'orange' }}>
                                    {photo.warning}
                                </div>
                            )}
                            <PhotoQualityWarning attachment={photo as any} />
                        </div>
                    </div>
                ))}
            </section>

            {/* Delete confirmation modal */}
            <Modal
                show={!!selectedPhotoForDelete}
                onHide={() => setSelectedPhotoForDelete(null)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete Photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPhotoForDelete && (
                        <center>
                            <img
                                src={selectedPhotoForDelete.url}
                                alt="Thumbnail of the photo to delete."
                                style={{ maxWidth: 180, borderRadius: 8 }}
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
                        onClick={() => setSelectedPhotoForDelete(null)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        aria-label="Confirm permanent photo deletion"
                        onClick={() => {
                            if (selectedPhotoForDelete) {
                                removePhoto(selectedPhotoForDelete.id)
                                setSelectedPhotoForDelete(null)
                            }
                        }}
                    >
                        Permanently Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <section className="progress-actions" style={{ marginTop: 32 }}>
                <div
                    className="progress-bar"
                    style={{
                        background: '#eee',
                        borderRadius: 8,
                        height: 16,
                        marginBottom: 8,
                    }}
                >
                    <div
                        className="progress"
                        style={{
                            background: '#007bff',
                            width: `${progress}%`,
                            height: '100%',
                            borderRadius: 8,
                        }}
                    />
                </div>
                <span>
                    {photos.length} of {requiredPhotos} required photos uploaded
                </span>
                <div style={{ marginTop: 16 }}>
                    <button
                        className="btn btn-success"
                        disabled={photos.length < requiredPhotos}
                    >
                        Submit All
                    </button>
                    <button
                        className="btn btn-secondary"
                        style={{ marginLeft: 8 }}
                    >
                        Cancel
                    </button>
                </div>
            </section>
        </div>
    )
}

export default ImprovedPhotoUpload
