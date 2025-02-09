import PouchDB from 'pouchdb'
import React, { useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { TfiImport } from 'react-icons/tfi'

import { useDatabase } from '../../../../providers/database_provider'
import { type Base, type Project } from '../../../../types/database.types'
import { sendBlob } from '../../../../utilities/blob_utils'
import { getProject } from '../../../../utilities/database_utils'
import {
    type JSONDocument,
    JSON_DOCUMENT_CONTENT_TYPE,
    JSON_DOCUMENT_FILE_EXTENSION,
    exportJSONDocument,
} from '../../../../utilities/json_serialization_utils'

interface ExportDocProps {
    projectId: PouchDB.Core.DocumentId
    includeInstallations: boolean
}

const ExportDoc: React.FC<ExportDocProps> = ({
    projectId,
    includeInstallations,
}) => {
    const db: PouchDB.Database<Base> = useDatabase()

    const handleClick = useCallback(
        async (
            event: React.MouseEvent<HTMLButtonElement>,
        ): Promise<boolean> => {
            event.stopPropagation()
            event.preventDefault()

            const projectDoc: PouchDB.Core.Document<Project> &
                PouchDB.Core.GetMeta = await getProject(db, projectId)

            const data: JSONDocument = await exportJSONDocument(
                db,
                projectId,
                includeInstallations,
            )

            const blob: Blob = new Blob([JSON.stringify(data)], {
                type: JSON_DOCUMENT_CONTENT_TYPE,
            })

            const fileName: string = `${projectDoc.metadata_.doc_name} ${new Date().toUTCString()}${JSON_DOCUMENT_FILE_EXTENSION}`

            sendBlob(blob, fileName)

            return false
        },
        [projectId, includeInstallations],
    )

    return (
        <Button variant="light" onClick={handleClick}>
            <TfiImport size={20} />
        </Button>
    )
}

export default ExportDoc
