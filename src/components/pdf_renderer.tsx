import React, { useState } from 'react'
import type { FC } from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

interface PDFRendererProps {
    label: string
    file: Blob
}

/**
 * Component for File input
 *
 * @param label Label for the File requirement
 * @param file Blob containing the file itself
 */
const PDFRenderer: FC<PDFRendererProps> = ({ label, file }) => {
    const [numPages, setNumPages] = useState(0)

    return (
        file && (
            <div>
                <h1>{label}</h1>
                <Document
                    file={file}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    renderMode="canvas"
                >
                    {Array.apply(null, Array(numPages))
                        .map((x, i) => i + 1)
                        .map(page => (
                            <Page
                                key={page}
                                pageNumber={page}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        ))}
                </Document>
            </div>
        )
    )
}

export default PDFRenderer
