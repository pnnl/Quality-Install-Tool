import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import Collapsible from './collapsible'
import type FileMetadata from '../types/file_metadata.types'
import DateTimeStr from './date_time_str'

interface FileInputProps {
    children: React.ReactNode
    label: string
    fileMetadata: FileMetadata
    file: Blob | undefined
    upsertFile: (file: Blob, fileName: string) => void
}

/**
 * Component for File input
 *
 * @param children Content (most commonly markdown text) describing the File requirement
 * @param label Label for the File requirement
 * @param file Blob containing the File itself
 * @param upsertFile Function used to update/insert a file into the store
 */
const FileInput: FC<FileInputProps> = ({
    children,
    label,
    file,
    fileMetadata,
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
                    <Collapsible header={label}>
                        <Card.Text as="div">{children}</Card.Text>
                    </Collapsible>
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
                                            {fileMetadata?.filename}
                                        </a>
                                        <br />
                                        <small>
                                            Timestamp:&nbsp;
                                            {fileMetadata?.timestamp ? (
                                                <DateTimeStr
                                                    date={
                                                        fileMetadata.timestamp
                                                    }
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
                        <div>
                            <label className="mb-3 custom-label">
                                File Types Accepted: PDF
                            </label>
                        </div>

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
