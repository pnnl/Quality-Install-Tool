import React from 'react'
import JSONValue from '../types/json_value.type'
import { Button } from 'react-bootstrap'
import { TfiArrowDown } from 'react-icons/tfi'

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
        // Create a Blob from the sendData
        const blob = new Blob([sendData as BlobPart], {
            type: 'application/octet-stream',
        })
        const url = URL.createObjectURL(blob)

        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${fileName}.qit`)

        // Append to the body, click and remove it
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Clean up the URL object
        URL.revokeObjectURL(url)
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
            <TfiArrowDown size={20} />
        </Button>
    )
}

export default ExportDoc
