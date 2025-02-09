import React from 'react'

import MdxWrapper from './mdx_wrapper'
import { StoreProvider } from './store'
import { useDatabase } from '../providers/database_provider'
import { useProject } from '../providers/project_provider'
import DOEProjectDetailsTemplate from '../templates/doe_project_details.mdx'

interface MdxProjectViewProps {}

const MdxProjectView: React.FC<MdxProjectViewProps> = () => {
    const db = useDatabase()

    const [project] = useProject()

    if (project) {
        return (
            <StoreProvider
                db={db}
                docId={project._id}
                workflowName=""
                docName={project.metadata_.doc_name}
                type={project.type}
            >
                <MdxWrapper
                    Component={DOEProjectDetailsTemplate}
                    Project={project}
                />
            </StoreProvider>
        )
    } else {
        return null
    }
}

export default MdxProjectView
