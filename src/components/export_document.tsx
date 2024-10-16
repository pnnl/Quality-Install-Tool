import React from 'react'
import JSONValue from '../types/json_value.type'
import { Button } from 'react-bootstrap'
import { TfiImport } from 'react-icons/tfi'
import { EXPORT_FILE_TYPE } from '../utilities/paths_utils'

interface ExportDocProps {
    sendData: JSONValue // The data to be downloaded
    fileName: string // The name of the file
}

/**
 * A component that triggers the download of a document as a file.
 * @param sendData - The data to be exported, json data from the DB.
 * @param fileName - The name of the file to be downloaded. (extension as *.qit)
 * @returns A React element that renders a button for downloading the document.
 */
const ExportDoc: React.FC<ExportDocProps> = ({
    sendData,
    fileName,
}: any): JSX.Element => {
    const handleDownload = () => {
        try {
            //Create a Blob from the sendData
            const blob = new Blob([sendData as BlobPart], {
                type: 'application/json',
            })
            const url = URL.createObjectURL(blob)

            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${fileName + EXPORT_FILE_TYPE}`)

            // Append to the body, click and remove it
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up the URL object
            URL.revokeObjectURL(url)
        } catch (error) {
            console.log('Error in exporting the document', error)
        }
    }
    return (
        <Button
            variant="light"
            onClick={event => {
                event.stopPropagation()
                event.preventDefault()
                handleDownload()
            }}
        >
            <TfiImport size={20} />
        </Button>
    )
}

export default ExportDoc
