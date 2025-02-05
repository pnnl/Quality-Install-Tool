import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC, MouseEvent } from 'react'
import { Button } from 'react-bootstrap'
import { useDB } from '../utilities/database_utils'
import { importJSONDocument } from '../utilities/json_serialization_utils'
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
    const [isFileProcessed, setIsFileProcessed] = useState<boolean>(false)
    const [error, setError] = useState<String>('')
    const db = useDB()

    const handleFileInputButtonClick = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        hiddenFileUploadInputRef.current?.click()
    }

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
                await importJSONDocument(db, JSON.parse(dataFromFile))
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
