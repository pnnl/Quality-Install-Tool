import PouchDB from 'pouchdb'
import React, { useCallback } from 'react'
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
}

const ExportDoc: React.FC<ExportDocProps> = ({ projectId }) => {
    const db = useDatabase()

    const handleClick = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            const projectDoc = await getProject(db, projectId)

            const data = await exportJSONDocument(db, projectId)

            const blob = new Blob([JSON.stringify(data)], {
                type: JSON_DOCUMENT_CONTENT_TYPE,
            })

            const fileName = `${projectDoc.metadata_.doc_name} ${new Date().toUTCString()}${JSON_DOCUMENT_FILE_EXTENSION}`

            sendBlob(blob, fileName)

            return false
        },
        [projectId],
    )

    return (
        <Button variant="light" onClick={handleClick}>
            <TfiImport size={20} />
        </Button>
    )
}

export default ExportDoc
