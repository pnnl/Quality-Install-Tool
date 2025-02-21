import React from 'react'

import MdxWrapper from '../../../mdx_wrapper'
import { useProject } from '../../../../providers/project_provider'
import StoreProvider, {
    useChangeEventHandler,
} from '../../../../providers/store_provider'
import DOEProjectDetailsTemplate from '../../../../templates/doe_project_details.mdx'

type MdxProjectViewProps = Record<string, never>

const MdxProjectView: React.FC<MdxProjectViewProps> = () => {
    const [project] = useProject()

    const handleChange = useChangeEventHandler()

    if (project) {
        return (
            <>
                <h1>Edit Project Information</h1>
                <h2>{project.metadata_.doc_name}</h2>
                <br />
                <StoreProvider doc={project} onChange={handleChange}>
                    <MdxWrapper
                        Component={DOEProjectDetailsTemplate}
                        project={project}
                    />
                </StoreProvider>
            </>
        )
    } else {
        return null
    }
}

export default MdxProjectView
