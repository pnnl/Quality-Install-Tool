import { useEffect, useId, useRef } from 'react'
import print from 'print-js'
import React, { FC, ReactNode } from 'react'
import Button from 'react-bootstrap/Button'

interface PrintSectionProps {
    children: ReactNode
    label: string
}

/**
 * Component with a print button for printing the component's child content
 *
 * @param children Content for printing
 * @param label Label for the print button
 */
const PrintSection: FC<PrintSectionProps> = ({ children, label }) => {
    const printContainerId = useId()
    const isSafari = () =>
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    const addSafariHeader = () => {
        if (isSafari()) {
            const printWrapper = document.getElementById(printContainerId)
            if (printWrapper) {
                const header = document.createElement('div')
                header.className = 'safari-print-header'
                header.innerText = 'DOE - Quality Installation Report' // Customize your header text
                printWrapper.prepend(header) // Add header at the top
            }
        }
    }
    return (
        <>
            <Button
                onClick={event => {
                    addSafariHeader()
                    print({
                        maxWidth: 2000,
                        printable: printContainerId,
                        onPrintDialogClose: () => {
                            document.title = 'Quality Install Tool'
                        },
                        type: 'html',
                        targetStyles: ['*'],
                        css: ['/bootstrap.min.css', '/print.css'],
                        documentTitle: 'DOE - Quality Installation Report',
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
