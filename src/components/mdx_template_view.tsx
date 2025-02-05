import { useState, type FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import dbName from '../utilities/db_details'
import { StoreProvider } from './store'
import MdxWrapper from './mdx_wrapper'
import templatesConfig from '../templates/templates_config'
import { retrieveDocFromDB, useDB } from '../utilities/database_utils'
import { getProjectSummary } from '../utilities/project_summary_utils'
import { ListGroup } from 'react-bootstrap'

/**
 * A component view of an instantiated MDX template
 *
 * @remarks
 * The installation ID (or jobId), parent doc id and workflow name
 * for the instance is taken from a dynamic segment of the route, :jobId, :projectId, workflowName.
 *
 */
const MdxTemplateView: FC = () => {
    const { jobId, projectId, workflowName } = useParams()
    const config = templatesConfig[workflowName as string]

    const [project, setProject] = useState<any>({})
    const [projectSummary, setProjectSummary] = useState<any>({})
    const [installationInfo, setInstallationInfo] = useState<any>({})
    const db = useDB()

    const project_info = async (): Promise<void> => {
        getProjectSummary(db, projectId as string, workflowName as string).then(
            (res: any) => {
                setProjectSummary(res)
            },
        )
    }

    const retrieveInstallationsInfo = async (): Promise<void> => {
        retrieveDocFromDB(db, jobId as string).then((res: any) => {
            setInstallationInfo(res)
        })
        retrieveDocFromDB(db, projectId as string).then((res: any) => {
            setProject(res)
        })
    }

    useEffect(() => {
        project_info()
        retrieveInstallationsInfo()
    }, [])

    const doc_name = installationInfo?.metadata_?.doc_name

    return (
        <StoreProvider
            dbName={dbName}
            docId={jobId as string}
            workflowName={workflowName as string}
            docName={doc_name}
            type={'installation'}
            parentId={projectId as string}
        >
            <h1>{projectSummary?.installation_name}</h1>
            <h2>Installation for {projectSummary?.project_name}</h2>
            <ListGroup className="address">
                {projectSummary?.street_address}
                {projectSummary?.city}
                {projectSummary?.state}
                {projectSummary?.zip_code}
            </ListGroup>
            <center>
                <b>{doc_name}</b>
            </center>
            <br />
            <MdxWrapper Component={config.template} Project={project} />
        </StoreProvider>
    )
}

export default MdxTemplateView
