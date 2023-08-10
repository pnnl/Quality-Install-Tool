import React, { FC } from 'react'
import { StoreContext } from './store'
import File from './file'


const MAX_IMAGE_DIM = 1280

interface FileWrapperProps {
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
const FileWrapper: FC<FileWrapperProps> = ({
    children,
    id,
    label,
}) => {
    return (
        <StoreContext.Consumer>
            {({ attachments, upsertAttachment }) => {
                return (
                    <File
                        children={children}
                        label={label}
                        metadata={attachments[id]?.metadata}
                        file={attachments[id]?.blob} />
                    )
            }}
        </StoreContext.Consumer>
    )
}

export default FileWrapper
