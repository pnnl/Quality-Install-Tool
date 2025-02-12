import React from 'react'

import PDFRenderer from './pdf_renderer'
import { StoreContext } from '../providers/store_provider'

interface PDFRenderedWrapperProps {
    id: string
    label: string
}

const PDFRenderedWrapper: React.FC<PDFRenderedWrapperProps> = ({
    id,
    label,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                const attachment =
                    doc &&
                    doc._attachments &&
                    (doc._attachments[id] as PouchDB.Core.FullAttachment)

                return (
                    <PDFRenderer
                        label={label}
                        file={attachment?.data as Blob}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PDFRenderedWrapper
