import PouchDB from 'pouchdb'
import React from 'react'

import FileInput from './file_input'
import { StoreContext } from '../providers/store_provider'
import { type FileMetadata } from '../types/database.types'

interface FileInputWrapperProps {
    id: string
    label: React.ReactNode
    children: React.ReactNode
}

const FileInputWrapper: React.FC<FileInputWrapperProps> = ({
    id,
    label,
    children,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc, putAttachment }) => {
                const attachment =
                    doc &&
                    doc._attachments &&
                    (doc._attachments[id] as PouchDB.Core.FullAttachment)

                const attachmentMetadata =
                    doc && (doc.metadata_.attachments[id] as FileMetadata)

                return (
                    <FileInput
                        label={label}
                        file={attachment?.data as Blob}
                        fileMetadata={attachmentMetadata}
                        upsertFile={async (blob, filename) =>
                            await putAttachment(id, blob, filename)
                        }
                    >
                        {children}
                    </FileInput>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default FileInputWrapper
