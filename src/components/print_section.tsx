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
    file_name = process.env.REACT_APP_PRINT_TITLE || 'QIT Report',
}) => {
    const printContainerId = useId()

    const addHeader = () => {
        const printWrapper = document.getElementById(printContainerId)
        if (printWrapper) {
            // Check if the header already exists
            const existingHeader = printWrapper.querySelector(
                '.safari-print-header',
            )
            if (!existingHeader) {
                const header = document.createElement('div')
                header.className = 'safari-print-header'
                header.innerText = process.env.REACT_APP_PRINT_TITLE
                printWrapper.prepend(header) // Add header at the top
            }
        }
    }

    const handlePrint = () => {
        addHeader()
        const customFileName = `${file_name}` // File name
        document.title = customFileName

        print({
            maxWidth: 2000,
            printable: printContainerId,
            onPrintDialogClose: () => {
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
