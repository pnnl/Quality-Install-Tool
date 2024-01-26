import { useState, type FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import dbName from './db_details'
import { StoreProvider } from './store'
import MdxWrapper from './mdx_wrapper'
import templatesConfig from '../templates/templates_config'
import {
    projectDetails,
    retrieveSingleProject,
} from '../utilities/database_utils'
import PouchDB from 'pouchdb'

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

    const project_info = async (): Promise<void> => {
        projectDetails(new PouchDB(dbName), project?._id, workflowName).then(
            res => {
                setProjectInfo(res)
            },
        )
    }

    useEffect(() => {
        project_info()
    }, [])

    const specificInstallation = project.installations_?.find(
        (x: { _id: string | undefined }) => x._id === docId,
    )

    const specificInstallationIndex = project.installations_?.findIndex(
        (x: { _id: string | undefined }) => x._id === docId,
    )

    return (
        // Note: docId is guaranteed to be a string because this component is only
        // used when the :docId dynamic route segment is set.
        <StoreProvider
            dbName={dbName}
            projectId={project._id}
            workflowName={workflowName}
            docName={specificInstallation.metadata_.doc_name}
            docId={docId as string}
            pathIndex={specificInstallationIndex}
        >
            <center>
                <b>
                    <div>
                        <h2>{projectInfo?.installation_name} Installation</h2>
                        <h3>
                            {projectInfo?.project_name} :{' '}
                            {specificInstallation.metadata_.doc_name}
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
