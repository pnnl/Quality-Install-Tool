import { useEffect, useId, useRef } from 'react'
import print from 'print-js'
import React, { FC, ReactNode } from 'react'
import Button from 'react-bootstrap/Button'

interface PrintSectionProps {
    children: ReactNode
    label: string
    title?: string
}

/**
 * Component with a print button for printing the component's child content
 *
 * @param children Content for printing
 * @param label Label for the print button
 */
const PrintSection: FC<PrintSectionProps> = ({ children, label, title }) => {
    const printContainerId = useId()
    return (
        <>
            <Button
                onClick={event => {
                    print({
                        maxWidth: 2000,
                        printable: printContainerId,
                        onLoadingEnd: () => {
                            document.title =
                                `QI Tool Report-${title || ''}`.trim()
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
