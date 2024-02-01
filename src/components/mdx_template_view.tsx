import { useState, type FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import dbName from './db_details'
import { StoreProvider } from './store'
import MdxWrapper from './mdx_wrapper'
import templatesConfig from '../templates/templates_config'
import {
    retrieveProjectSummary,
    retrieveProjectDetails,
} from '../utilities/database_utils'
import PouchDB from 'pouchdb'
import { toNumber } from 'lodash'

interface MdxTemplateViewProps {
    workflowName: string
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
const MdxTemplateView: FC<MdxTemplateViewProps> = ({
    workflowName,
    project,
}) => {
    const { docId } = useParams()
    const config = templatesConfig[workflowName]

    const [projectInfo, setProjectInfo] = useState<any>({})
    const [installationInfo, setInstallationInfo] = useState<any>({})

    const project_info = async (): Promise<void> => {
        retrieveProjectSummary(
            new PouchDB(dbName),
            project?._id,
            workflowName,
        ).then((res: any) => {
            setProjectInfo(res)
        })
    }

    const retrieveInstallationsInfo = async (): Promise<void> => {
        retrieveProjectDetails(new PouchDB(dbName), project?._id).then(
            (res: any) => {
                setInstallationInfo(res)
            },
        )
    }

    useEffect(() => {
        project_info()
        retrieveInstallationsInfo()
    }, [])

    let specificInstallation = installationInfo.installations_?.find(
        (x: { _id: string | undefined }) => x._id == docId,
    )

    if (!specificInstallation) {
        specificInstallation = project.installations_?.find(
            (x: { _id: string | undefined }) => x._id == docId,
        )
    }

    const doc_name = specificInstallation?.metadata_?.doc_name

    // let specificInstallationIndex = -1
    // for (const x in installationInfo.installations_) {
    //     if (installationInfo.installations_[x]._id == docId)
    //         specificInstallationIndex = toNumber(x)
    // }


    let specificInstallationIndex = project.installations_?.findIndex(
        (x: { _id: string | undefined }) => x._id == docId,
    )

    return (
        // Note: docId is guaranteed to be a string because this component is only
        // used when the :docId dynamic route segment is set.
        <StoreProvider
            dbName={dbName}
            projectId={project._id}
            workflowName={workflowName}
            docName={doc_name}
            docId={docId as string}
            pathIndex={specificInstallationIndex}
        >
            <center>
                <b>
                    <div>
                        <h2>{projectInfo?.installation_name} Installation</h2>
                        <h3>
                            {projectInfo?.project_name} :{' '}
                            {specificInstallation?.metadata_?.doc_name}
                        </h3>
                        {projectInfo?.street_address}
                        {projectInfo?.city}
                        {projectInfo?.state}
                        {projectInfo?.zip_code}
                    </div>
                </b>
            </center>
            <br />

            {templatesConfig[workflowName].title.includes('BETA') ? (
                <div className="beta-text">
                    The template is currently in its BETA version, intended for
                    testing purposes. Please be aware that any data utilized
                    within these templates will not be retained once the final
                    version of the template is released.{' '}
                </div>
            ) : null}
            <MdxWrapper Component={config.template} Project={project} />
        </StoreProvider>
    )
}


export default MdxTemplateView
