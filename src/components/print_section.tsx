import print from 'print-js'
import React, { useId, useMemo } from 'react'
import { Button } from 'react-bootstrap'

import { useWorkflow } from '../providers/workflow_provider'

interface PrintSectionProps {
    title?: string
    label: React.ReactNode
    children: React.ReactNode
}

const PrintSection: React.FC<PrintSectionProps> = ({
    title,
    label,
    children,
}) => {
    const workflow = useWorkflow()

    const documentTitle = useMemo<string>(() => {
        if (title) {
            return title
        } else if (workflow) {
            return `${process.env.REACT_APP_NAME} - ${workflow.title}`
        } else {
            return process.env.REACT_APP_NAME
        }
    }, [title, workflow])

    const printContainerId = useId()
    const isSafari = () =>
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    const addSafariHeader = () => {
        if (isSafari()) {
            const printWrapper = document.getElementById(printContainerId)
            if (printWrapper) {
                const header = document.createElement('div')
                header.className = 'safari-print-header'
                header.innerText = documentTitle
                printWrapper.prepend(header) // Add header at the top
            }
        }
    }
    return (
        <>
            <Button
                onClick={() => {
                    addSafariHeader()
                    document.title = documentTitle // Set basename for PDF document
                    print({
                        maxWidth: 2000,
                        printable: printContainerId,
                        onPrintDialogClose: () => {
                            document.title = process.env.REACT_APP_NAME
                        },
                        type: 'html',
                        targetStyles: ['*'],
                        css: ['/bootstrap.min.css', '/print.css'],
                        documentTitle,
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
