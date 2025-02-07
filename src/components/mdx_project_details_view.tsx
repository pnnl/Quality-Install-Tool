import { Suspense, useEffect, useState, type FC } from 'react'
import { useParams } from 'react-router-dom'
import { StoreProvider } from './store'
import React from 'react'
import { useDatabase } from '../providers/database_provider'
import { getProject } from '../utilities/database_utils'

// Lazily initializes the components, rendering them only when requested.
// This reduces the bundle size when the app is loaded, improving initial load time
const DOEProjectDetailsTemplate = React.lazy(
    () => import('../templates/doe_project_details.mdx'),
)
const MdxWrapper = React.lazy(() => import('./mdx_wrapper'))

/**
 * A component view of an instantiated MDX template
 * It serves as a central component for accessing and managing project information.
 *
 */
const MdxProjectView: FC = () => {
    // Note: 'project?._id' is the docId from the DB.
    const { projectId } = useParams()
    const [projectDoc, setProjectDoc] = useState<any>({})
    const db = useDatabase()

    const project_info = async (): Promise<void> => {
        getProject(db, projectId as string).then((res: any) => {
            setProjectDoc(res)
        })
    }

    useEffect(() => {
        project_info()
    }, [])

    return (
        <StoreProvider
            db={db}
            docId={projectId as string}
            workflowName=""
            docName={projectDoc?.metadata_?.doc_name}
            type="project"
        >
            <Suspense fallback={<div>Loading..</div>}>
                <MdxWrapper
                    Component={DOEProjectDetailsTemplate}
                    Project={projectDoc}
                />
            </Suspense>
        </StoreProvider>
    )
}

export default MdxProjectView
