import PouchDB from 'pouchdb'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'

import { useDatabase } from '../../../../providers/database_provider'
import {
    type JSONDocument,
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

    const [error, setError] = useState<string | undefined>(undefined)

    const reader = useMemo<FileReader>(() => {
        const _reader = new FileReader()

        _reader.onload = async (event: ProgressEvent<FileReader>) => {
            const text = (event.target as FileReader).result as string

            try {
                const data = JSON.parse(text)

                try {
                    const responses = await importJSONDocument(db, data)

                    setError(undefined)

                    onImport && (await onImport(responses))
                } catch (cause) {
                    setError(`Failed to import JSON: ${cause}`)
                }
            } catch (cause) {
                setError(`Failed to parse as JSON: ${cause}`)
            }
        }

        return _reader
    }, [])

    const handleChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
                const file = event.target.files[0]

                if (file) {
                    if (file.name.endsWith(JSON_DOCUMENT_FILE_EXTENSION)) {
                        reader.readAsText(file)
                    } else {
                        setError(
                            `Please select file with extension '${JSON_DOCUMENT_FILE_EXTENSION}'.`,
                        )
                    }
                }

                event.target.value = ''
            }
        },
        [reader],
    )

    return (
        <>
            <Button onClick={() => ref.current?.click()}>{label}</Button>
            <input
                ref={ref}
                className="photo-upload-input"
                type="file"
                accept={`*${JSON_DOCUMENT_FILE_EXTENSION}`}
                onChange={handleChange}
            />
            {error && <div className="error">{error}</div>}
        </>
    )
}

export default ImportDoc
