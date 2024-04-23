import { useState, type FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import dbName from './db_details'
import { StoreProvider } from './store'
import MdxWrapper from './mdx_wrapper'
import templatesConfig from '../templates/templates_config'
import {
    retrieveProjectSummary,
    retrieveProjectDoc,
} from '../utilities/database_utils'
import PouchDB from 'pouchdb'
import { toNumber } from 'lodash'
import { ListGroup } from 'react-bootstrap'

interface MdxTemplateViewProps {
    workflowName: string
    project: any
}

/**
 * A component view of an instantiated MDX template
 *
 * @remarks
 * The installation ID (or jobID) for the instance is taken from a dynamic segment
 * of the route, :jobId.
 *
 * @param workflowName - The name associated with an MDX template
 * @param project - The parent doc object that holds the installation information
 */
const MdxTemplateView: FC<MdxTemplateViewProps> = ({
    workflowName,
    project,
}) => {
    const { jobId } = useParams()
    const config = templatesConfig[workflowName]

    const [projectInfo, setProjectInfo] = useState<any>({})
    const [installationInfo, setInstallationInfo] = useState<any>({})

    const project_info = async (): Promise<void> => {
        retrieveProjectSummary(new PouchDB(dbName), project?._id, workflowName)
            .then((res: any) => {
                setProjectInfo(res)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const retrieveInstallationsInfo = async (): Promise<void> => {
        retrieveProjectDoc(new PouchDB(dbName), project?._id)
            .then((res: any) => {
                setInstallationInfo(res)
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        project_info()
        retrieveInstallationsInfo()
    }, [])

    let specificInstallation = installationInfo.installations_?.find(
        (x: { _id: string | undefined }) => x._id == jobId,
    )

    if (!specificInstallation) {
        specificInstallation = project.installations_?.find(
            (x: { _id: string | undefined }) => x._id == jobId,
        )
    }

    const doc_name = specificInstallation?.metadata_?.doc_name

    let specificInstallationIndex = project.installations_?.findIndex(
        (x: { _id: string | undefined }) => x._id == jobId,
    )

    return (
        // Note: jobId is guaranteed to be a string because this component is only
        // used when the :jobId dynamic route segment is set.
        <StoreProvider
            dbName={dbName}
            docId={project._id}
            workflowName={workflowName}
            docName={doc_name}
            jobId={jobId as string}
            pathIndex={specificInstallationIndex}
        >
            <h1>{projectInfo?.installation_name}</h1>
            <h2>Installation for {projectInfo?.project_name}</h2>
            <ListGroup className="address">
                {projectInfo?.street_address}
                {projectInfo?.city}
                {projectInfo?.state}
                {projectInfo?.zip_code}
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
