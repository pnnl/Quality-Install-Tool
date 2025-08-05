import React, { useId } from 'react'
import { Button } from 'react-bootstrap'
import print from 'print-js'

interface PrintSectionProps {
    children: React.ReactNode
    label: React.ReactNode
    file_name?: string // Optional prop for dynamic file name
}

const PrintSection: React.FC<PrintSectionProps> = ({
    children,
    label,
    file_name,
}) => {
    const printContainerId = useId()

    const addHeader = () => {
        const printWrapper = document.getElementById(printContainerId)
        if (printWrapper) {
            const header = document.createElement('div')
            header.className = 'safari-print-header'
            header.innerText = process.env.REACT_APP_PRINT_TITLE // Header for Safari
            printWrapper.prepend(header) // Add header at the top
        }
    }

    const handlePrint = () => {
        addHeader()
        const customFileName = `${file_name}` // File name
        document.title = customFileName

        print({
            printable: printContainerId,
            type: 'html',
            maxWidth: 2000,
            targetStyles: ['*'],
            scanStyles: false,
            css: ['/bootstrap.min.css', '/print.css'],
            documentTitle: customFileName,
        })
    }

    return (
        <>
            <Button onClick={handlePrint} variant="primary">
                {label}
            </Button>
            <div id={printContainerId}>
                <div className="print-wrapper">{children}</div>
            </div>
        </>
    )
}

export default PrintSection
