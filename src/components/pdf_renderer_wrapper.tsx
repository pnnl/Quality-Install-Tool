import React, { FC } from 'react'
import { StoreContext } from './store'
import PDFRenderer from './pdf_renderer'

const MAX_FILE_SIZE = 5 // in MB

interface PDFRenderedWrapperProps {
    children: React.ReactNode
    id: string
    label: string
}

/**
 * A component that wraps a PDFRenderer component in order to tie it to the data store
 *
 * @param children Content (most commonly markdown text) to be passed on as the children
 * @param id An identifier for the store attachment that represents the File details
 * @param label The label of the PDFRenderer component
 */
const PDFRenderedWrapper: FC<PDFRenderedWrapperProps> = ({
    children,
    id,
    label,
}) => {
    return (
        <StoreContext.Consumer>
            {({ attachments, upsertAttachment }) => {
                const attachment = Object.getOwnPropertyDescriptor(
                    attachments,
                    id,
                )?.value

                return (
                    <PDFRenderer
                        children={children}
                        label={label}
                        fileMetadata={attachment?.metadata}
                        file={attachment?.blob}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PDFRenderedWrapper
