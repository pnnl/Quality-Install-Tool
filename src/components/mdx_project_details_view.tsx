import { useEffect, useState, type FC } from 'react'
import { useParams } from 'react-router-dom'
import PouchDB from 'pouchdb'
import { StoreProvider } from './store'
import MdxWrapper from './mdx_wrapper'
import DOEProjectDetailsTemplate from '../templates/doe_project_details.mdx'
import dbName from './db_details'
import { retrieveDocFromDB } from '../utilities/database_utils'

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
            docName={projectDoc.metadata_?.doc_name}
            type="project"
        >
            <h1>Project Details</h1>
            <h3>{projectDoc.metadata_?.doc_name}</h3>
            <MdxWrapper
                Component={DOEProjectDetailsTemplate}
                Project={projectDoc}
            />
        </StoreProvider>
    )
}

export default MdxProjectView
