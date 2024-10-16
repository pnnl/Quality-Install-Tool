import { Suspense, useEffect, useState, type FC } from 'react'
import { useParams } from 'react-router-dom'
import PouchDB from 'pouchdb'
import { StoreProvider } from './store'
import dbName from './db_details'
import React from 'react'

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
    const db = new PouchDB(dbName)

    const project_info = async (): Promise<void> => {
        // Dynamically import the function when needed
        const { retrieveDocFromDB } = await import(
            '../utilities/database_utils'
        )

        retrieveDocFromDB(db, projectId as string).then((res: any) => {
            setProjectDoc(res)
        })
    }

    useEffect(() => {
        project_info()
    }, [])

    return (
        <StoreProvider
            dbName={dbName}
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
