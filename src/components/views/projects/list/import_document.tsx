import PouchDB from 'pouchdb'
import React, { useCallback, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'

import { useDatabase } from '../../../../providers/database_provider'
import {
    JSON_DOCUMENT_FILE_EXTENSION,
    importJSONDocument,
} from '../../../../utilities/json_serialization_utils'

interface ImportDocProps {
    label: string
    onImport: (
        responses: Array<PouchDB.Core.Response | PouchDB.Core.Error>,
    ) => void | Promise<void>
}

const ImportDoc: React.FC<ImportDocProps> = ({ label, onImport }) => {
    const db = useDatabase()

    const ref = useRef<HTMLInputElement>(null)
    const importInProgress = useRef(false)

    const [error, setError] = useState<string | undefined>(undefined)
    const [isImporting, setIsImporting] = useState(false)

    const handleChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            event.target.value = ''

            if (!file || importInProgress.current) {
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

                if (failures.length > 0) {
                    setError(
                        `Failed to import ${failures.length} of ${responses.length} documents: ${failures.map(failure => failure.message ?? failure.reason ?? failure.name ?? 'Unknown database error').join('; ')}. Some documents may already have been imported.`,
                    )
                }
            } catch (cause) {
                setError(`Failed to import JSON: ${cause}`)
            } finally {
                importInProgress.current = false
                setIsImporting(false)
            }
        },
        [db, onImport],
    )

    return (
        <>
            <Button
                onClick={() => ref.current?.click()}
                disabled={isImporting}
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
                disabled={isImporting}
            />
            {error && (
                <div className="error" role="alert">
                    {error}
                </div>
            )}
        </>
    )
}

export default ImportDoc
