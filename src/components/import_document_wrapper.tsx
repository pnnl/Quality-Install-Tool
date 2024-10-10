import { FC } from 'react'
import ImportDoc from './import_document'

// Define the props interface for ImportDocWrapper
interface ImportDocWrapperProps {
    id: string
    label: string
}

/**
 * ImportDocWrapper component.
 *
 * This component wraps the `ImportDoc` component, retrieves attachments and job ID from the context, constructs
 * a reference ID, and passes the appropriate file blob and label to `ImportDoc`.
 *
 * @param {string} label - The label to be displayed for the import operation.
 *
 * @returns {JSX.Element} The rendered ImportDoc component with context-provided props.
 */
const ImportDocWrapper: FC<ImportDocWrapperProps> = ({
    id,
    label,
}: ImportDocWrapperProps): JSX.Element => {
    return <ImportDoc id={id} label={label} />
}

export default ImportDocWrapper
