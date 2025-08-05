import React from 'react'

import PrintSection from './print_section'
import { StoreContext } from '../providers/store_provider'
import { ProjectDocument, useProject } from '../providers/project_provider'
import { BaseMetadata, InstallationMetadata } from '../types/database.types'

const generateFileName = (
    project: ProjectDocument | undefined,
    metadata: BaseMetadata | undefined,
) => {
    return (
        [
            project?.metadata_?.doc_name,
            project?.data_?.location?.street_address,
            metadata && 'template_title' in metadata
                ? (metadata as InstallationMetadata).template_title
                : undefined,
            metadata?.doc_name,
        ]
            .filter(value => value !== undefined && value !== null)
            .join('_') + process.env.REACT_APP_PDF_DOCUMENT_FILE_EXTENSION
    )
}

interface PrintSectionWrapperProps {
    children: React.ReactNode
    label: React.ReactNode
}

const PrintSectionWrapper: React.FC<PrintSectionWrapperProps> = ({
    children,
    label,
}) => {
    const [project] = useProject()
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return (
                    <PrintSection
                        label={label}
                        file_name={generateFileName(project, doc?.metadata_)}
                    >
                        {children}
                    </PrintSection>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PrintSectionWrapper
