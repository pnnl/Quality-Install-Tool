import React, { FC } from 'react'
import { StoreContext } from './store'
import FileInput from './file_input'


const MAX_IMAGE_DIM = 1280

interface FileInputWrapperProps {
    children: React.ReactNode
    id: string
    label: string
}

/**
 * A component that wraps a PhotoInput component in order to tie it to the data store
 *
 * @param children Content (most commonly markdown text) to be passed on as the PhotInput
 * children
 * @param id An identifier for the store attachment that represents the photo for
 * the PhotoInput component
 * @param label The label of the PhotoInput component
 */
const FileInputWrapper: FC<FileInputWrapperProps> = ({
    children,
    id,
    label,
}) => {
    return (
        <StoreContext.Consumer>
            {({ attachments, upsertAttachment }) => {
                const upsertFile = (img_file: Blob, fileName: string) => {
                    upsertAttachment(img_file, id, fileName)
                 
                }
                console.log("file", attachments[id])

                return (
                    <FileInput
                        label={label}
                        metadata={attachments[id]?.metadata}
                        file={attachments[id]?.blob}
                        upsertFile={upsertFile} >
                        {children}
                    </FileInput>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default FileInputWrapper