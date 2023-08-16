import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import Collapsible from './collapsible'
import type FileMetadata from '../types/file_metadata.types'
import DateTimeStr from './date_time_str'

interface FileInputProps {
    children: React.ReactNode
    label: string
    metadata: FileMetadata
    file: Blob | undefined
    upsertFile: (file: Blob, fileName: string) => void
}

/**
 * Component for File input
 *
 * @param children Content (most commonly markdown text) describing the File requirement
 * @param label Label for the File requirement
 * @param photo Blob containing the photo itself
 * @param upsertFile Function used to update/insert a file into the store
 */
const FileInput: FC<FileInputProps> = ({
    children,
    label,
    file,
    metadata,
    upsertFile,
}) => {
    // Create references to the hidden file inputs
    const hiddenFileUploadInputRef = useRef<HTMLInputElement>(null)

    const handleFileInputButtonClick = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        hiddenFileUploadInputRef.current &&
            hiddenFileUploadInputRef.current.click()
    }

    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0]
            const fileName = file.name
            upsertFile(file, fileName)
        }
    }

    // Button text based on whether there is a File or not
    const buttonText = !file ? 'Add File' : 'Replace File'

    return (
        <>
            <Card className="input-card">
                <Card.Body>
                    <label className="custom-label"> {label} </label>
                    <Card.Text as="div" className="custom-label">
                        {children}
                    </Card.Text>
                    <div>
                        {file && (
                            <>
                                <Card className="input-card">
                                    <Card.Body>
                                        File Name:{' '}
                                        <a
                                            href={URL.createObjectURL(file)}
                                            target="_blank"
                                        >
                                            {metadata?.filename}
                                        </a>
                                        <br />
                                        <small>
                                            Timestamp:&npsp;
                                            {metadata?.timestamp ? (
                                                <DateTimeStr
                                                    date={metadata.timestamp}
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </small>
                                        <br />
                                    </Card.Body>
                                </Card>
                            </>
                        )}
                        <Button
                            onClick={handleFileInputButtonClick}
                            variant="outline-primary"
                        >
                            {buttonText}
                        </Button>
                    </div>

                    <input
                        accept="application/pdf"
                        onChange={handleFileInputChange}
                        ref={hiddenFileUploadInputRef}
                        className="photo-upload-input"
                        type="file"
                    />
                </Card.Body>
            </Card>
        </>
    )
}

export default FileInput
