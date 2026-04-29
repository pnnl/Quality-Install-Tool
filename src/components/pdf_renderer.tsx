import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

interface PDFRendererProps {
    label: string
    file: Blob | undefined
    fileName?: string
}

const PDFRenderer: React.FC<PDFRendererProps> = ({ label, file, fileName }) => {
    const [numPages, setNumPages] = useState(0)

    return (
        file && (
            <div>
                <h1>{label}</h1>
                {fileName && <p>File Name: {fileName}</p>}
                <Document
                    file={file}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    renderMode="canvas"
                >
                    {[...Array(numPages).keys()]
                        .map(key => key + 1)
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
