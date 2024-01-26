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
 *
 * @remarks
 * The document Id for the instance is taken from a dynamic segment
 * of the route, :docId.
 *
 * @param dbName - The database name associated with an MDX template
 */
const MdxProjectView: FC<MdxProjectViewProps> = ({ project }) => {
    const { docId } = useParams()

    const projectId = project._id

    return (
        // Note: docId is guaranteed to be a string because this component is only
        // used when the :docId dynamic route segment is set.
        <StoreProvider
            dbName={dbName}
            projectId={project?._id as string}
            workflowName=""
            docName={project?.metadata_?.project_name}
            docId=""
            pathIndex={-1}
        >
            <h1>Project Details</h1>
            <h3>{project?.metadata_?.project_name}</h3>
            <MdxWrapper
                Component={DOEProjectDetailsTemplate}
                Project={project}
            />
        </StoreProvider>
    )
}

export default MdxProjectView
