import { useState, type FC, useEffect } from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import templatesConfig from '../templates/templates_config'
import { getInstallations, useDB } from '../utilities/database_utils'
import { getProjectSummary } from '../utilities/project_summary_utils'
import { useParams } from 'react-router-dom'

/**
 * A component View to lists workflow names, facilitating the selection of workflows
 * when generating quality installation reports.
 *
 */
const WorkFlowView: FC = () => {
    const [workflowJobsCount, setWorkflowJobsCount] = useState<{
        [jobId: string]: number
    }>({})

    const { projectId } = useParams()
    const [projectInfo, setProjectInfo] = useState<any>({})
    const db = useDB()

    // Retrieves the installation details with the specific workflow name
    const retrieveJobs = async (workflowName: string): Promise<void> => {
        getInstallations(db, projectId as string, workflowName).then(res => {
            setWorkflowJobsCount(prevArray => ({
                ...prevArray,
                [workflowName]: res.length,
            }))
        })
    }
    const project_info = async (): Promise<void> => {
        // Retrieves the project information which includes project name and installation address
        getProjectSummary(db, projectId as string, '').then((res: any) => {
            setProjectInfo(res)
        })
    }

    useEffect(() => {
        Object.keys(templatesConfig).map(key => retrieveJobs(key))
        project_info()
    }, [])

    const project_name = projectInfo?.project_name
        ? projectInfo?.project_name
        : ''
    const street_address = projectInfo?.street_address
        ? projectInfo?.street_address
        : ''
    const city = projectInfo?.city ? projectInfo?.city : ''
    const state = projectInfo?.state ? projectInfo?.state : ''
    const zip_code = projectInfo?.zip_code ? projectInfo?.zip_code : ''
    const templates = Object.keys(templatesConfig).map(key => (
        <LinkContainer key={key} to={`/app/${projectId}/${key}`}>
            <ListGroup.Item key={key} action={true}>
                {templatesConfig[key as keyof typeof templatesConfig].title}{' '}
                {workflowJobsCount[key] > 0 && `(${workflowJobsCount[key]})`}
            </ListGroup.Item>
        </LinkContainer>
    ))
    return (
        <div>
            <h1>Choose an Installation Workflow</h1>
            <h2>Installations for {project_name} </h2>
            <ListGroup className="address">
                {' ' + street_address}
                {city}
                {state} {'   '}
                {zip_code}
            </ListGroup>
            <br />

            <div className="container">
                <ListGroup>{templates}</ListGroup>
            </div>
        </div>
    )
}

export default WorkFlowView
