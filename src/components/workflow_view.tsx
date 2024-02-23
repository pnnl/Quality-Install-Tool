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
import DropDownMenu from './dropdown_wrapper'

interface WorkflowProps {
    project: any
}

const WorkFlowView: FC<WorkflowProps> = ({ project }) => {
    const [workflowJobsCount, setWorkflowJobsCount] = useState<{
        [jobId: string]: number
    }>({})
    const [projectInfo, setProjectInfo] = useState<any>({})

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
    const street_address = projectInfo?.street_address
    const city = projectInfo?.city
    const state = projectInfo?.state
    const zip_code = projectInfo?.zip_code
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
            <h3>
                Project address:
                {' ' + street_address}
                {city}
                {state} {'   '}
                {zip_code}
            </h3>
            <br />
            <ListGroup>{templates}</ListGroup>
        </div>
    )
}

export default WorkFlowView
