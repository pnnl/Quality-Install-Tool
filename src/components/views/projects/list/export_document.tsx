import PouchDB from 'pouchdb'
import React, { useCallback, useState } from 'react'
import { Button } from 'react-bootstrap'
import { TfiImport } from 'react-icons/tfi'

import { useDatabase } from '../../../../providers/database_provider'
import { sendBlob } from '../../../../utilities/blob_utils'
import { getProject } from '../../../../utilities/database_utils'
import {
    JSON_DOCUMENT_CONTENT_TYPE,
    JSON_DOCUMENT_FILE_EXTENSION,
    exportJSONDocument,
} from '../../../../utilities/json_serialization_utils'

interface ExportDocProps {
    projectId: PouchDB.Core.DocumentId
    variant?: string
    onDownload?: () => void | Promise<void>
    showAlert?: boolean
}

const ExportDoc: React.FC<ExportDocProps> = ({
    projectId,
    variant,
    onDownload,
    showAlert,
}) => {
    const db = useDatabase()
    const [isDownloading, setIsDownloading] = useState(false)

    const handleClick = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()
            setIsDownloading(true)
            try {
                const projectDoc = await getProject(db, projectId)

                const data = await exportJSONDocument(db, projectId)

                const blob = new Blob([JSON.stringify(data)], {
                    type: JSON_DOCUMENT_CONTENT_TYPE,
                })

                const fileName = `${
                    projectDoc?.metadata_?.doc_name ?? 'project'
                } ${new Date().toUTCString()}${JSON_DOCUMENT_FILE_EXTENSION}`

                sendBlob(blob, fileName)

                onDownload && (await onDownload())
            } finally {
                setIsDownloading(false)
            }
            return false
        },
        [db, projectId, onDownload],
    )

    return (
        <Button
            variant={variant}
            onClick={handleClick}
            disabled={isDownloading}
            className={variant === 'outline-light' ? 'download-button' : ''}
            style={{ position: 'relative' }}
        >
            {showAlert && <div className="red-circle"></div>}
            {variant === 'outline-light' ? (
                <>
                    <TfiImport />
                    &nbsp; Download
                </>
            ) : (
                <TfiImport size={20} />
            )}
        </Button>
    )
}

export default ExportDoc
