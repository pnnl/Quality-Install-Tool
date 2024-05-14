import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import Collapsible from './collapsible'
import type FileMetadata from '../types/file_metadata.types'
import DateTimeStr from './date_time_str'
import dbName from './db_details'
import PouchDB from 'pouchdb'

interface ImportDBDocProps {
    children: React.ReactNode
    label: string
    file: Blob | undefined
}

/**
 * Component for File input
 *
 * @param children Content (most commonly markdown text) describing the File requirement
 * @param label Label for the File requirement
 * @param file Blob containing the File itself
 * @param upsertFile Function used to update/insert a file into the store
 */
const ImportDBDoc: FC<ImportDBDocProps> = ({ children, label, file }) => {
    // Create references to the hidden file inputs
    const hiddenFileUploadInputRef = useRef<HTMLInputElement>(null)

    const handleFileInputButtonClick = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        hiddenFileUploadInputRef.current &&
            hiddenFileUploadInputRef.current.click()
    }
    const db = new PouchDB(dbName)
    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.readAsText(file)
                reader.onload = event => {
                    const dataFromFile = (event.target as FileReader).result
                    if (dataFromFile) {
                        const input_doc = JSON.parse(dataFromFile as string)
                        delete input_doc.id
                        delete input_doc._rev
                        input_doc.metadata_.project_name =
                            input_doc.metadata_.project_name + '(Imported)'
                        db.post(input_doc)
                    }
                }
            }
        }
    }

    // Button text based on whether there is a File or not
    const buttonText = 'Import a Project'

    return (
        <>
            {' '}
            &nbsp;
            <Button onClick={handleFileInputButtonClick}>{buttonText}</Button>
            <input
                accept="application/json"
                onChange={handleFileInputChange}
                ref={hiddenFileUploadInputRef}
                className="photo-upload-input"
                type="file"
            />
        </>
    )
}

export default ImportDBDoc
