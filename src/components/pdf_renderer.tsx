import React, { useState } from 'react'
import type { FC } from 'react'
import type FileMetadata from '../types/file_metadata.types'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

interface PDFRendererProps {
    children: React.ReactNode
    label: string
    metadata: FileMetadata
    file: Blob 
}

/**
 * Component for File input
 *
 * @param children Content (most commonly markdown text) describing the File requirement
 * @param label Label for the File requirement
 * @param file Blob containing the file itself
 * @param upsertFile Function used to update/insert a file into the store
 */
const PDFRenderer: FC<PDFRendererProps> = ({ children, label, file, metadata }) => {
    const [numPages, setNumPages] = useState(0);

  return ( file && (
          <div>
            <h1>{label}: {metadata?.filename}</h1>
            <Document file={file}
                      onLoadSuccess={({ numPages })=>setNumPages(numPages)}
                      renderMode="canvas">
                        {Array.apply(null, Array(numPages))
                        .map((x, i)=>i+1)
                        .map(page => <Page key={page} pageNumber={page} renderTextLayer={false} renderAnnotationLayer={false} />)}
            </Document>
          </div>)
  )
}

export default PDFRenderer
