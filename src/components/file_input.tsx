import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card } from 'react-bootstrap'

import Collapsible from './collapsible'
import DateTimeStr from './date_time_str'
import { type FileMetadata } from '../types/database.types'

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
const FileInput: React.FC<FileInputProps> = ({
    children,
    label,
    file,
    fileMetadata,
    upsertFile,
}) => {
    const hiddenFileUploadInputRef = useRef<HTMLInputElement>(null)

    const handleFileInputButtonClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            hiddenFileUploadInputRef.current &&
                hiddenFileUploadInputRef.current.click()
        },
        [],
    )

    const handleFileInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files && event.target.files.length > 0) {
                const file = event.target.files[0]

                upsertFile(file, file.name)
            }
        },
        [],
    )

    const [fileObjectURL, setFileObjectURL] = useState<string | undefined>(
        undefined,
    )

    useEffect(() => {
        const objectURL = file ? URL.createObjectURL(file) : undefined

        setFileObjectURL(objectURL)

        return () => {
            if (objectURL) {
                URL.revokeObjectURL(objectURL)
            }
        }
    }, [file])

    return (
        <Card className="input-card">
            <Card.Body>
                <Collapsible header={label}>
                    <Card.Text as="div">{children}</Card.Text>
                </Collapsible>
                <div>
                    {file && (
                        <Card className="input-card">
                            <Card.Body>
                                File Name:{' '}
                                {fileObjectURL && (
                                    <a
                                        href={fileObjectURL}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {fileMetadata?.filename}
                                    </a>
                                )}
                                <br />
                                <small>
                                    Timestamp:{' '}
                                    {fileMetadata?.timestamp ? (
                                        <DateTimeStr
                                            date={fileMetadata.timestamp}
                                        />
                                    ) : (
                                        ''
                                    )}
                                </small>
                                <br />
                            </Card.Body>
                        </Card>
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
                        {file ? 'Replace File' : 'Add File'}
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
    )
}

export default FileInput
