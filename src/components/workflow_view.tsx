import { useState, type FC, useEffect } from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import templatesConfig from '../templates/templates_config'
import {
    retrieveJobs_db,
    retrieveProjectSummary,
} from '../utilities/database_utils'
import dbName from './db_details'
import PouchDB from 'pouchdb'

interface WorkflowProps {
    project: any
}

/**
 * A component View to lists workflow names, facilitating the selection of workflows
 * when generating quality installation reports.
 *
 * @param project: doc object from db for the respective project
 */
const WorkFlowView: FC<WorkflowProps> = ({ project }) => {
    const [workflowJobsCount, setWorkflowJobsCount] = useState<{
        [jobId: string]: number
    }>({})
    const [projectInfo, setProjectInfo] = useState<any>({})

    // Retrieves the installation details with the specific workflow name
    const retrieveJobs = async (workflowName: string): Promise<void> => {
        const newArray = retrieveJobs_db(
            new PouchDB(dbName),
            project?._id,
            workflowName,
        ).then(res => {
            setWorkflowJobsCount(prevArray => ({
                ...prevArray,
                [workflowName]: res.length,
            }))
        })
    }
    const project_info = async (): Promise<void> => {
        // Retrieves the project information which includes project name and installation address
        retrieveProjectSummary(new PouchDB(dbName), project?._id, '').then(
            (res: any) => {
                setProjectInfo(res)
            },
        )
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
        <LinkContainer key={key} to={`/app/${project._id}/${key}`}>
            <ListGroup.Item key={key} action={true}>
                {templatesConfig[key as keyof typeof templatesConfig].title} (
                {workflowJobsCount[key]})
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
            <ListGroup>{templates}</ListGroup>
        </div>
    )
}

export default WorkFlowView
