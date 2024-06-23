import { FC } from 'react'
import ImportDBDoc from './import_db_doc'

// Define the props interface for ImportDBDocWrapper
interface ImportDBDocWrapperProps {
    id: string
    label: string
}

/**
 * ImportDBDocWrapper component.
 *
 * This component wraps the `ImportDBDoc` component, retrieves attachments and job ID from the context, constructs
 * a reference ID, and passes the appropriate file blob and label to `ImportDBDoc`.
 *
 * @param {string} label - The label to be displayed for the import operation.
 *
 * @returns {JSX.Element} The rendered ImportDBDoc component with context-provided props.
 */
const ImportDBDocWrapper: FC<ImportDBDocWrapperProps> = ({
    id,
    label,
}: ImportDBDocWrapperProps): JSX.Element => {
    return <ImportDBDoc id={id} label={label} />
}

export default ImportDBDocWrapper
