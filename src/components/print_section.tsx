import React, { useId } from 'react'
import { Button } from 'react-bootstrap'
import print from 'print-js'

interface PrintSectionProps {
    children: React.ReactNode
    label: React.ReactNode
}

const PrintSection: React.FC<PrintSectionProps> = ({ children, label }) => {
    const printContainerId = useId()
    const isSafari = () =>
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    const addSafariHeader = () => {
        if (isSafari()) {
            const printWrapper = document.getElementById(printContainerId)
            if (printWrapper) {
                const header = document.createElement('div')
                header.className = 'safari-print-header'
                header.innerText = process.env.REACT_APP_PRINT_TITLE
                printWrapper.prepend(header) // Add header at the top
            }
        }
    }
    return (
        <>
            <Button
                onClick={() => {
                    addSafariHeader()
                    print({
                        maxWidth: 2000,
                        printable: printContainerId,
                        onPrintDialogClose: () => {
                            document.title = process.env.REACT_APP_NAME
                        },
                        type: 'html',
                        targetStyles: ['*'],
                        css: ['/bootstrap.min.css', '/print.css'],
                        documentTitle: process.env.REACT_APP_PRINT_TITLE,
                        scanStyles: false,
                    })
                }}
                variant="primary"
            >
                {label}
            </Button>
            <div id={printContainerId}>
                <div className="print-wrapper">{children}</div>
            </div>
        </>
    )
}

export default PrintSection
