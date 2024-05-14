import React, { FC } from 'react'
import { StoreContext } from './store'
import ImportDBDoc from './import_db_doc'

interface ImportDBDocWrapperProps {
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
const ImportDBDocWrapper: FC<ImportDBDocWrapperProps> = ({
    children,
    id,
    label,
}) => {
    return (
        <StoreContext.Consumer>
            {({ attachments, jobId, upsertAttachment }: any) => {
                //  JobId for installation level updates
                let id_ref = jobId != '' ? jobId + '.' + id : id

                return (
                    <ImportDBDoc label={label} file={attachments[id_ref]?.blob}>
                        {children}
                    </ImportDBDoc>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default ImportDBDocWrapper
