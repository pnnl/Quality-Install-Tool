import React, { useId } from 'react'
import { Button } from 'react-bootstrap'
import print from 'print-js'

interface PrintSectionProps {
    children: React.ReactNode
    label: React.ReactNode
    fileName?: string // Optional prop for dynamic file name
}

const PrintSection: React.FC<PrintSectionProps> = ({
    children,
    label,
    fileName = process.env.REACT_APP_PRINT_TITLE || 'QIT Report',
}) => {
    const printContainerId = useId()

    const addHeader = () => {
        const printWrapper = document.getElementById(printContainerId)
        if (printWrapper) {
            // Check if the header already exists
            const existingHeader = printWrapper.querySelector('.print-header')
            if (!existingHeader) {
                const header = document.createElement('div')
                header.className = 'print-header'
                header.innerText = process.env.REACT_APP_PRINT_TITLE || ''
                printWrapper.prepend(header) // Add header at the top
                return header // Return the header so we can remove it later
            }
        }
        return null
    }

    const handlePrint = () => {
        const header = addHeader()
        const customFileName = `${fileName}`
        document.title = customFileName

        print({
            maxWidth: 2000,
            printable: printContainerId,
            onPrintDialogClose: () => {
                // Remove the header after printing
                if (header && header.parentNode) {
                    header.parentNode.removeChild(header)
                }
                document.title = process.env.REACT_APP_PRINT_TITLE
            },
            type: 'html',
            targetStyles: ['*'],
            css: ['/bootstrap.min.css', '/print.css'],
            documentTitle: customFileName,
            scanStyles: false,
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
