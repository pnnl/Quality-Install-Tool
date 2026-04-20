import React from 'react'
import PouchDB from 'pouchdb'
import { get } from 'lodash'

import PDFRenderer from './pdf_renderer'
import { StoreContext } from '../providers/store_provider'
import { type Base } from '../types/database.types'

interface PDFRenderedWrapperProps {
    id: string
    label: string
    parent?: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta
}

const PDFRenderedWrapper: React.FC<PDFRenderedWrapperProps> = ({
    id,
    label,
    parent,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                const sourceDoc = parent ?? doc

                const attachment =
                    sourceDoc &&
                    sourceDoc._attachments &&
                    (sourceDoc._attachments[id] as PouchDB.Core.FullAttachment)

                return (
                    <PDFRenderer
                        label={label}
                        file={attachment?.data as Blob}
                        fileName={
                            (sourceDoc &&
                                get(sourceDoc.data_, `${id}_filename`)) ||
                            undefined
                        }
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PDFRenderedWrapper
