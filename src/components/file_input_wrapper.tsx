import React, { FC } from 'react'
import { StoreContext } from './store'
import FileInput from './file_input'

interface FileInputWrapperProps {
    children: React.ReactNode
    id: string
    label: string
}

/**
 * A component that wraps a FileInput component in order to tie it to the data store
 *
 * @param children Content (most commonly markdown text) to be passed on as the FileInput children
 * @param id An identifier for the store attachment that represents the information of the file
 * @param label The label of the PhotoInput component
 */
const FileInputWrapper: FC<FileInputWrapperProps> = ({
    children,
    id,
    label,
}) => {
    return (
        <StoreContext.Consumer>
            {({ attachments, jobId, upsertAttachment }) => {
                //  JobId for installation level updates
                const id_ref = `${jobId === '' ? '' : `${jobId}.`}${id}`
                const attachment = Object.getOwnPropertyDescriptor(
                    attachments,
                    id_ref,
                )?.value
                const upsertFile = (img_file: Blob, fileName: string) => {
                    upsertAttachment(img_file, id_ref, fileName)
                }
                return (
                    <FileInput
                        label={label}
                        fileMetadata={attachment?.metadata}
                        file={attachment?.blob}
                        upsertFile={upsertFile}
                    >
                        {children}
                    </FileInput>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default FileInputWrapper
