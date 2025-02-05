import { FC, useEffect, useState } from 'react'
import ExportDoc from './export_document'
import { useDB } from '../utilities/database_utils'
import { exportJSONDocument } from '../utilities/json_serialization_utils'
import JSONValue from '../types/json_value.type'

// Define the props interface for ExportDocWrapper
interface ExportDocWrapperProps {
    docId: string
    docName: string
    includeChild: boolean
}

/**
 * A wrapper component for `ExportDoc` that exports a document from a PouchDB database as a JSON object.
 * @param {string} props.docId - The ID of the document to be exported.
 * @param {string} props.docName - The name of the document, used for naming the export file.
 * @param {boolean} props.includeChild - A flag indicating whether to include child documents in the export.
 * @returns {JSX.Element} A React element that renders the `ExportDoc` component with the exported data.
 */
const ExportDocWrapper: FC<ExportDocWrapperProps> = ({
    docId,
    docName,
    includeChild,
}: ExportDocWrapperProps): JSX.Element => {
    const db = useDB()
    const [sendData, setSendData] = useState<JSONValue>({})

    useEffect(() => {
        exportJSONDocument(db, docId, includeChild).then(data =>
            setSendData(JSON.stringify(data)),
        )
    }, [])

    const timestamp = new Date(Date.now()).toUTCString()
    return (
        <ExportDoc sendData={sendData} fileName={docName + ' ' + timestamp} />
    )
}

export default ExportDocWrapper
