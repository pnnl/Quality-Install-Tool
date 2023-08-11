import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import Collapsible from './collapsible'
import type FileMetadata from '../types/file_metadata.types'
import DateTimeStr from './date_time_str'
import printJS from 'print-js'
import { eventNames } from 'process'



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
const File: FC<FileProps> = ({
    children,
    label,
    file,
    metadata,
}) => {

    const handlePrintButtonClick = (event: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, fileBlob: Blob | MediaSource) => {
        event.preventDefault();
        printJS(URL.createObjectURL(fileBlob));
    }

    return (
        <>
            {file && (
            
                    <Card className="input-card">
                        <Card.Body>
                            <h2> {label} </h2>
                            <Card.Text as="div">{children}</Card.Text>
                            <div className="row">
                                <div className="col-sm-8">
                                File Name: <a href={URL.createObjectURL(file)} target="_blank">{metadata?.filename}</a> 
                                <br />
                                <small>
                                    Timestamp: 
                                    {metadata?.timestamp ? (
                                        <DateTimeStr date={metadata.timestamp} />
                                    ) : ""
                                    }
                                </small>
                                </div>
                                <div className="col-sm-4">
                                <Button
                                    onClick={(event) => handlePrintButtonClick(event,file)}>Print File
                                </Button> 
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                 
            )}
            
        </>
    )
}

export default File
