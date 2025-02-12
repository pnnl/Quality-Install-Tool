import PouchDB from 'pouchdb'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'

import { useDatabase } from '../../../../providers/database_provider'
import { type Base } from '../../../../types/database.types'
import {
    type JSONDocument,
    JSON_DOCUMENT_FILE_EXTENSION,
    importJSONDocument,
} from '../../../../utilities/json_serialization_utils'

interface ImportDocProps {
    label: string
    onImport: (projectId: PouchDB.Core.DocumentId) => void | Promise<void>
}

const ImportDoc: React.FC<ImportDocProps> = ({ label, onImport }) => {
    const db: PouchDB.Database<Base> = useDatabase()

    const ref = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string | undefined>(undefined)

    const reader = useMemo<FileReader>(() => {
        const _reader: FileReader = new FileReader()

        _reader.onload = async (
            event: ProgressEvent<FileReader>,
        ): Promise<void> => {
            const text: string = (event.target as FileReader).result as string

            try {
                const data: JSONDocument = JSON.parse(text)

                try {
                    const [projectResponse, installationResponses] =
                        await importJSONDocument(db, data)

                    if (projectResponse.ok) {
                        setError(undefined)

                        onImport && (await onImport(projectResponse.id))
                    } else {
                        setError('Failed to save product document.')
                    }
                } catch (cause) {
                    setError('Failed to import JSON.')
                }
            } catch (cause) {
                setError('Failed to parse as JSON.')
            }
        }

        return _reader
    }, [])

    const handleChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
            if (event.target.files) {
                const file: File = event.target.files[0]

                if (file) {
                    if (file.name.endsWith(JSON_DOCUMENT_FILE_EXTENSION)) {
                        reader.readAsText(file)
                    } else {
                        setError(
                            `Please select file with extension '${JSON_DOCUMENT_FILE_EXTENSION}'.`,
                        )
                    }
                }
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
