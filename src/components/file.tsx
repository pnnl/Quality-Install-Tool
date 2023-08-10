import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import Collapsible from './collapsible'
import type FileMetadata from '../types/file_metadata.types'
import DateTimeStr from './date_time_str'


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
 * @param photo Blob containing the photo itself
 * @param upsertFile Function used to update/insert a file into the store
 */
const File: FC<FileProps> = ({
    children,
    label,
    file,
    metadata,
}) => {

    const handlePrintButtonClick = (event: ChangeEvent<HTMLInputElement>) => {
       alert("print")
    }

    return (
        <>
            <Card className="input-card">
                <Card.Body> {file && (<>
                    <h2> {label} </h2>
                    <Card.Text as="div">{children}</Card.Text>
                    <div>
                       
                        <Card className="input-card">
                            <Card.Body>
                                File Name: <a href={URL.createObjectURL(file)} target="_blank">{metadata?.filename}Test</a> 
                                <br />
                                <small>
                                    Timestamp: 
                                    {metadata?.timestamp ? (
                                        <DateTimeStr date={metadata.timestamp} />
                                    ) : ""
                                    }
                                </small>
                                <br/>
                                <Button
                                    onClick={handlePrintButtonClick}
                                    variant="outline-primary">Print File
                                </Button> 
                            </Card.Body>
                        </Card>
                        
                    </div></>)}
                </Card.Body>
            </Card>
        </>
    )
}

export default File
