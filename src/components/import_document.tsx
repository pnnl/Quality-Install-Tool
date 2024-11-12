import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button } from 'react-bootstrap'
import { ImportDocumentIntoDB, useDB } from '../utilities/database_utils'
import { EXPORT_FILE_TYPE } from '../utilities/paths_utils'

interface ImportDocProps {
    id: string
    label: string
}

/**
 * ImportDoc component : Imports JSON documents into a PouchDB database.
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
const ImportDoc: FC<ImportDocProps> = ({ id, label }) => {
    // Create references to the hidden file inputs
    const hiddenFileUploadInputRef = useRef<HTMLInputElement>(null)
    const [projectNames, setProjectNames] = useState<string[]>([])
    const [isFileProcessed, setIsFileProcessed] = useState<boolean>(false)
    const [error, setError] = useState<String>('')
    const db = useDB()

    const handleFileInputButtonClick = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        hiddenFileUploadInputRef.current?.click()
    }

    /**
     * Fetches project names from the database and updates the state.
     *
     * @returns {Promise<void>} A promise that resolves when the fetch operation is complete.
     */
    const fetchProjectNames = async (): Promise<void> => {
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
        // Retrieve all project names from the database when each upload is processed
        fetchProjectNames()
    }, [projectNames, isFileProcessed])

    const handleFileInputChange = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.files) {
            const file = event.target.files[0]
            if (file) {
                const isValid = file.name.endsWith(EXPORT_FILE_TYPE)
                if (!isValid) {
                    setError(
                        "Please select file with extension '" +
                            EXPORT_FILE_TYPE +
                            "'",
                    )
                } else {
                    setError('')
                    processJsonData(file) // Processes JSON data from a file
                }
            }
            event.target.value = ''
        }
    }

    /**
     * Processes JSON data from a file and imports it into the database.
     *
     * @param {File} file - The JSON file containing documents to be imported.
     * @returns {Promise<void>} A promise that resolves when the processing is complete.
     */
    const processJsonData = async (file: File): Promise<void> => {
        // Reset state and local variables for every import
        setIsFileProcessed(false)

        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = async event => {
            const dataFromFile = (event.target as FileReader).result
            if (typeof dataFromFile !== 'string') {
                console.error('File content is not a string.')
                return
            }
            try {
                const jsonData = JSON.parse(dataFromFile)
                await ImportDocumentIntoDB(db, jsonData, projectNames)
            } catch (error) {
                console.error('Error parsing JSON from file:', error)
            }
        }
    }
    return (
        <>
            {' '}
            &nbsp;
            <Button onClick={handleFileInputButtonClick}>{label}</Button>
            <input
                accept={'*' + EXPORT_FILE_TYPE}
                onChange={handleFileInputChange}
                ref={hiddenFileUploadInputRef}
                className="photo-upload-input"
                type="file"
            />
            {error && <div className="error">{error}</div>}
        </>
    )
}

export default ImportDoc
