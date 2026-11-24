import PouchDB from 'pouchdb'
import React, { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from 'react-bootstrap'

import { useDatabase } from '../../../../providers/database_provider'
import {
    JSON_DOCUMENT_FILE_EXTENSION,
    importJSONDocument,
} from '../../../../utilities/json_serialization_utils'
import { isBrowserStorageError } from '../../../../utilities/storage_error_utils'

const STORAGE_FULL_MESSAGE =
    'Import failed because this browser appears to have reached its storage limit. Please download older projects and remove them from the browser, then try again.'

interface ImportDocProps {
    label: string
    disabled?: boolean
    /**
     * Where to show the error message. Use this when the button sits in a
     * shrink-to-fit flex row, where an inline message would stretch the row
     * and push the buttons around. Defaults to directly after the button.
     */
    errorContainer?: HTMLElement | null
    onImport: (
        responses: Array<PouchDB.Core.Response | PouchDB.Core.Error>,
    ) => void | Promise<void>
}

const ImportDoc: React.FC<ImportDocProps> = ({
    label,
    disabled = false,
    errorContainer,
    onImport,
}) => {
    const db = useDatabase()

    const ref = useRef<HTMLInputElement>(null)
    const importInProgress = useRef(false)

    const [error, setError] = useState<string | undefined>(undefined)
    const [isImporting, setIsImporting] = useState(false)

    const handleChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            event.target.value = ''

            if (!file || disabled || importInProgress.current) {
                return
            }

            if (!file.name.endsWith(JSON_DOCUMENT_FILE_EXTENSION)) {
                setError(
                    `Please select file with extension '${JSON_DOCUMENT_FILE_EXTENSION}'.`,
                )
                return
            }

            importInProgress.current = true
            setIsImporting(true)
            setError(undefined)

            try {
                const text = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result as string)
                    reader.onerror = () =>
                        reject(
                            reader.error ?? new Error('Failed to read file.'),
                        )
                    reader.onabort = () =>
                        reject(new Error('File reading was cancelled.'))
                    reader.readAsText(file)
                })

                let data
                try {
                    data = JSON.parse(text)
                } catch (cause) {
                    setError(`Failed to parse as JSON: ${cause}`)
                    return
                }

                const responses = await importJSONDocument(db, data)
                const failures = responses.filter(
                    (response): response is PouchDB.Core.Error =>
                        'error' in response,
                )

                await onImport(responses)

                if (failures.some(failure => isBrowserStorageError(failure))) {
                    setError(
                        `${STORAGE_FULL_MESSAGE} Some documents may already have been imported.`,
                    )
                } else if (failures.length > 0) {
                    setError(
                        `Failed to import ${failures.length} of ${responses.length} documents: ${failures.map(failure => failure.message ?? failure.reason ?? failure.name ?? 'Unknown database error').join('; ')}. Some documents may already have been imported.`,
                    )
                }
            } catch (cause) {
                setError(
                    isBrowserStorageError(cause)
                        ? STORAGE_FULL_MESSAGE
                        : `Failed to import JSON: ${cause}`,
                )
            } finally {
                importInProgress.current = false
                setIsImporting(false)
            }
        },
        [db, disabled, onImport],
    )

    const errorMessage = error ? (
        <div className="error" role="alert">
            {error}
        </div>
    ) : null

    return (
        <>
            <Button
                onClick={() => ref.current?.click()}
                disabled={isImporting || disabled}
                aria-busy={isImporting}
            >
                {isImporting ? 'Importing...' : label}
            </Button>
            <input
                ref={ref}
                className="photo-upload-input"
                type="file"
                accept={`*${JSON_DOCUMENT_FILE_EXTENSION}`}
                onChange={handleChange}
                disabled={isImporting || disabled}
            />
            {errorMessage &&
                (errorContainer
                    ? createPortal(errorMessage, errorContainer)
                    : errorMessage)}
        </>
    )
}

export default ImportDoc
