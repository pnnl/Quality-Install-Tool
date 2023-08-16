import React, { useState } from 'react'
import type { FC } from 'react'
import { Button, Card } from 'react-bootstrap'
import type FileMetadata from '../types/file_metadata.types'
import DateTimeStr from './date_time_str'
import printJS from 'print-js'

interface FileProps {
    children: React.ReactNode
    label: string
    metadata: FileMetadata
    file: Blob | undefined
}

/**
 * Component for File input
 *
 * @param children Content (most commonly markdown text) describing the File requirement
 * @param label Label for the File requirement
 * @param file Blob containing the file itself
 * @param upsertFile Function used to update/insert a file into the store
 */
const File: FC<FileProps> = ({ children, label, file, metadata }) => {
    const [showPrintInstructions, setShowPrintInstructions] = useState(false)

    const isMobileDevice = () => {
        const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent,
            )
        return isMobile
            ? navigator.userAgent.includes('Mac') && 'ontouchend' in document
            : isMobile
    }

    const handlePrintButtonClick = (
        event: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        fileBlob: Blob | MediaSource,
    ) => {
        event.preventDefault()
        isMobileDevice()
            ? setShowPrintInstructions(true)
            : printJS({ printable: URL.createObjectURL(fileBlob), type: 'pdf' })
        return false
    }

    return (
        <>
            {file && (
                <>
                    <Card className="input-card">
                        <Card.Body>
                            <label className="custom-label"> {label} </label>
                            <Card.Text as="div">{children}</Card.Text>
                            <div className="row">
                                <div className="col-sm-8 label">
                                    File Name:{' '}
                                    <a
                                        href={URL.createObjectURL(file)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {metadata?.filename}
                                    </a>
                                    <br />
                                    <small>
                                        Timestamp:
                                        {metadata?.timestamp ? (
                                            <DateTimeStr
                                                date={metadata.timestamp}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </small>
                                </div>
                                {showPrintInstructions ? (
                                    <Card className="input-card">
                                        <Card.Body className="custom-label">
                                            <p>
                                                {' '}
                                                Print the{' '}
                                                <strong>{label}</strong>{' '}
                                                manually from your mobile
                                                device. Follow these steps to
                                                print it:
                                            </p>
                                            <ol>
                                                <li>
                                                    <strong>
                                                        Click on the File Name
                                                        link.
                                                    </strong>{' '}
                                                    PDF will open in another
                                                    browser window or tab on
                                                    your device.
                                                </li>
                                                <li>
                                                    <strong>
                                                        Tap the 'Share' button
                                                        or icon
                                                    </strong>{' '}
                                                    (usually an arrow pointing
                                                    upwards or a box with an
                                                    arrow).
                                                </li>
                                                <li>
                                                    From the sharing menu,{' '}
                                                    <strong>
                                                        select the 'Print'
                                                        option.
                                                    </strong>
                                                </li>
                                                <li>
                                                    <strong>
                                                        Configure print settings
                                                    </strong>{' '}
                                                    such as the number of
                                                    copies, page range, paper
                                                    size, and orientation.
                                                </li>
                                                <li>
                                                    <strong>Tap 'Print'</strong>{' '}
                                                    or 'Start Printing' to
                                                    initiate the printing
                                                    process.
                                                </li>
                                            </ol>
                                            <Button
                                                className="custom-button"
                                                onClick={() =>
                                                    setShowPrintInstructions(
                                                        false,
                                                    )
                                                }
                                            >
                                                Close Instructions
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                ) : (
                                    <div className="col-sm-4">
                                        <Button
                                            onClick={event =>
                                                handlePrintButtonClick(
                                                    event,
                                                    file,
                                                )
                                            }
                                        >
                                            Open and Print
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}
        </>
    )
}

export default File
