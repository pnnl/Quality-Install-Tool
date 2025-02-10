import React, { FC } from 'react'
import { StoreContext } from './store'
import PDFRenderer from './pdf_renderer'

const MAX_FILE_SIZE = 5 // in MB

interface PDFRenderedWrapperProps {
    id: string
    label: string
}

/**
 * A component that wraps a PDFRenderer component in order to tie it to the data store
 *
 * @param id An identifier for the store attachment that represents the File details
 * @param label The label of the PDFRenderer component
 */
const PDFRenderedWrapper: FC<PDFRenderedWrapperProps> = ({ id, label }) => {
    return (
        <StoreContext.Consumer>
            {({ attachments, upsertAttachment }) => {
                const attachment = Object.getOwnPropertyDescriptor(
                    attachments,
                    id,
                )?.value

                return <PDFRenderer label={label} file={attachment?.blob} />
            }}
        </StoreContext.Consumer>
    )
}

export default PDFRenderedWrapper
