import type { FC } from 'react'
import { useParams } from 'react-router-dom'

import { StoreProvider } from './store'
import MdxWrapper from './mdx_wrapper'
import DOEProjectDetailsTemplate from '../templates/doe_project_details.mdx'
import dbName from './db_details'

interface MdxProjectViewProps {
    project: any
}

/**
 * A component view of an instantiated MDX template
 * It serves as a central component for accessing and managing project information.
 *
 * @param project - doc object from db for the respective project
 */
const MdxProjectView: FC<MdxProjectViewProps> = ({ project }) => {
    // Note: 'project?._id' is the docId from the DB.
    const projectId = project?._id
    return (
        <StoreProvider
            dbName={dbName}
            docId={project?._id as string}
            workflowName=""
            docName={project?.metadata_?.project_name}
            jobId=""
            pathIndex={-1}
        >
            <h1>Project Details</h1>
            <h3>{project?.metadata_?.project_name}</h3>
            <MdxWrapper
                Component={DOEProjectDetailsTemplate}
                JobId=""
                Project={project}
            />
        </StoreProvider>
    )
}

export default MdxProjectView
