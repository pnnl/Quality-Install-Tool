import { useEffect, useState, type FC } from 'react'
import { useParams } from 'react-router-dom'
import { StoreProvider } from './store'
import MdxWrapper from './mdx_wrapper'
import {
    DEFAULT_POUCHDB_DATABASE_NAME,
    getProject,
    useDB,
} from '../utilities/database_utils'
import DOECombustionTestTemplate from '../templates/doe_workflow_combustion_appliance_safety_tests.mdx'

/**
 * A component view of an instantiated MDX template
 * It serves as a central component for accessing and managing project information.
 *
 */
const MdxCombustionSafetyView: FC = () => {
    // Note: 'project?._id' is the docId from the DB.
    const { projectId } = useParams()
    const [projectDoc, setProjectDoc] = useState<any>({})
    const db = useDB()

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
            dbName={DEFAULT_POUCHDB_DATABASE_NAME}
            docId={projectId as string}
            workflowName=""
            docName={projectDoc?.metadata_?.doc_name}
            type="project"
        >
            <h1>Combustion Appliance Safety Testing</h1>
            <h2>Installation for {projectDoc?.metadata_?.doc_name}</h2>
            <center>
                <h3>
                    {projectDoc?.data_?.location?.street_address}&nbsp;
                    {projectDoc?.data_?.location?.city}
                    {projectDoc?.data_?.location?.state}&nbsp;
                    {projectDoc?.data_?.location?.zip_code}
                </h3>
            </center>
            <br />
            <MdxWrapper Component={DOECombustionTestTemplate} />
        </StoreProvider>
    )
}

export default MdxCombustionSafetyView
