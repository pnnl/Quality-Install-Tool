import React, { useId } from 'react'
import { Button } from 'react-bootstrap'

import PATHS from '../config/routes'

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

    const buildPrintHtml = () => {
        const printWrapper = document.getElementById(printContainerId)
        if (!printWrapper) {
            return null
        }

        const wrapperClone = printWrapper.cloneNode(true) as HTMLElement

        // Convert canvas elements (e.g. PDF pages rendered by react-pdf) to
        // <img> tags so their content survives the HTML serialization into the
        // print view. cloneNode does not preserve canvas pixel data.
        const originalCanvases = printWrapper.querySelectorAll('canvas')
        const clonedCanvases = wrapperClone.querySelectorAll('canvas')
        originalCanvases.forEach((canvas, index) => {
            try {
                const dataUrl = canvas.toDataURL('image/png')
                const img = document.createElement('img')
                img.src = dataUrl
                img.style.width = canvas.style.width || `${canvas.width}px`
                img.style.height = canvas.style.height || `${canvas.height}px`
                clonedCanvases[index]?.parentNode?.replaceChild(
                    img,
                    clonedCanvases[index],
                )
            } catch {
                // Canvas may be tainted (cross-origin); skip replacement
            }
        })

        const existingHeader = wrapperClone.querySelector('.print-header')

        if (!existingHeader) {
            const header = document.createElement('div')
            header.className = 'print-header print-header-title'
            header.innerText = process.env.REACT_APP_PRINT_TITLE || ''
            wrapperClone.prepend(header)
        }

        return wrapperClone.innerHTML
    }

    const handlePrint = () => {
        const html = buildPrintHtml()
        if (!html) {
            return
        }

        const payloadKey = `print-${Date.now()}-${Math.random().toString(36).slice(2)}`
        const payloadValue = JSON.stringify({
            html,
            title: fileName,
        })

        const printWindow = window.open('about:blank', '_blank')

        if (!printWindow) {
            window.alert(
                'Print tab could not be opened. Please allow pop-ups for this site and try again.',
            )
            return
        }

        try {
            localStorage.setItem(payloadKey, payloadValue)
            // Keep a same-tab fallback for older flows.
            sessionStorage.setItem(payloadKey, payloadValue)
        } catch {
            // Continue; payload is also transferred through window.name.
        }

        const printUrl = `${PATHS.PRINT}?key=${encodeURIComponent(payloadKey)}`
        printWindow.name = payloadValue
        printWindow.location.replace(printUrl)
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
