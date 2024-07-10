import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import Collapsible from './collapsible'
import type FileMetadata from '../types/file_metadata.types'
import DateTimeStr from './date_time_str'
import dbName from './db_details'
import PouchDB from 'pouchdb'

interface ImportDBDocProps {
    id: string
    label: string
}

/**
 * ImportDBDoc component : Imports JSON documents into a PouchDB database.
 *
 * This component handles the importation of a project document from a JSON file into a PouchDB database.
 * It renders a button that, when clicked, triggers a hidden file input to open. When a file is selected,
 * the file's content is read, processed, and imported into the database.
 *
 * @param label - The label for the import operation.
 * @param file - The file to be imported.
 *
 * @returns The rendered button and hidden file input elements for importing a project.
 */
const ImportDBDoc: FC<ImportDBDocProps> = ({ id, label }) => {
    // Create references to the hidden file inputs
    const hiddenFileUploadInputRef = useRef<HTMLInputElement>(null)
    const [projectNames, setProjectNames] = useState<string[]>([])
    const [installationIds, setInstallationIds] = useState<string[]>([])
    const [projectId, setProjectId] = useState<string>('')
    const [isFileProcessed, setIsFileProcessed] = useState<boolean>(false)

    const handleFileInputButtonClick = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        hiddenFileUploadInputRef.current &&
            hiddenFileUploadInputRef.current.click()
    }
    const db = new PouchDB(dbName)

    /**
     * Updates the project.children with imported installationIds in the project doc.
     * Retrieves the project document using projectId and updates its children field.
     */
    const updateProject = async () => {
        if (projectId) {
            const projectDoc: any = await db.get(projectId)
            projectDoc.children = installationIds
            try {
                await db.put(projectDoc)
            } catch (error) {
                console.log('Error in updating the project doc in DB', error)
            }
        }
    }

    const fetchProjectNames = async () => {
        const result = await db.allDocs({
            include_docs: true,
        })
        const projectDocs = result.rows
            .map((row: any) => row.doc)
            .filter((doc: any) => doc.type === 'project')

        const projectNames = projectDocs.map(
            (doc: any) => doc.metadata_.doc_name,
        )
        setProjectNames(projectNames)
    }

    useEffect(() => {
        // Retrieve all project names from the database
        fetchProjectNames()
    }, [projectNames])

    useEffect(() => {
        // Update project doc with the imported installation ids
        if (isFileProcessed) updateProject()
    }, [installationIds])

    const handleFileInputChange = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        // Reset state variables for every import
        setInstallationIds([])
        setProjectId('')
        setIsFileProcessed(false)

        if (event.target.files) {
            const file = event.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.readAsText(file)
                reader.onload = async event => {
                    const dataFromFile = (event.target as FileReader).result
                    if (typeof dataFromFile !== 'string') {
                        console.error('File content is not a string.')
                        return
                    }
                    fetchProjectNames()

                    try {
                        const jsonData = JSON.parse(dataFromFile)

                        // Process each document in the JSON data
                        for (const input_doc of jsonData.all_docs) {
                            if (!input_doc || !input_doc.metadata_) continue

                            delete input_doc._id
                            delete input_doc._rev

                            // Adjust doc_name for projects to avoid duplicates
                            if (input_doc.type === 'project') {
                                const doc_name =
                                    input_doc.metadata_.doc_name || ''
                                const count = projectNames.filter(
                                    name => name === doc_name,
                                ).length
                                input_doc.metadata_.doc_name =
                                    count > 0
                                        ? `${doc_name} (${count})`
                                        : doc_name
                            }

                            const now = new Date()
                            input_doc.metadata_.created_at = now
                            input_doc.metadata_.last_modified_at = now

                            const result = await db.post(input_doc)

                            // Update state based on document type
                            if (input_doc.type === 'installation') {
                                setInstallationIds(prevIds => [
                                    result.id,
                                    ...prevIds,
                                ])
                            } else {
                                setProjectId(result.id)
                            }
                        }

                        setIsFileProcessed(true)
                    } catch (error) {
                        console.error('Error parsing JSON from file:', error)
                    }
                }
            }
        }

        // Reset input value to allow selecting the same file again
        event.target.value = ''
    }

    const buttonText = label

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
