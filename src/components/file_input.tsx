import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Button, Card } from 'react-bootstrap'

import Collapsible from './collapsible'
import DateTimeStr from './date_time_str'
import { type FileMetadata } from '../types/database.types'

interface FileInputProps {
    label: React.ReactNode
    file: Blob | undefined
    fileMetadata: FileMetadata | undefined
    upsertFile: (file: Blob, fileName: string) => Promise<void>
    children: React.ReactNode
}

const FileInput: React.FC<FileInputProps> = ({
    children,
    label,
    file,
    fileMetadata,
    upsertFile,
}) => {
    const id = useId()

    const hiddenFileUploadInputRef = useRef<HTMLInputElement>(null)

    const handleFileInputButtonClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            hiddenFileUploadInputRef.current &&
                hiddenFileUploadInputRef.current.click()
        },
        [],
    )

    const handleFileInputChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files && event.target.files.length > 0) {
                const file = event.target.files[0]

                await upsertFile(file, file.name)
            }
        },
        [upsertFile],
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
                                    {fileMetadata?.timestamp && (
                                        <DateTimeStr
                                            date={fileMetadata.timestamp}
                                        />
                                    )}
                                </small>
                                <br />
                            </Card.Body>
                        </Card>
                    )}
                    <p className="mb-3 custom-label">
                        File Types Accepted: PDF
                    </p>
                    <Button
                        onClick={handleFileInputButtonClick}
                        variant="outline-primary"
                    >
                        {file ? 'Replace File' : 'Add File'}
                    </Button>
                </div>
                <input
                    id={id}
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
