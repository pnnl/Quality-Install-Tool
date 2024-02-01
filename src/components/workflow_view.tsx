import { useState, type FC, useEffect } from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import templatesConfig from '../templates/templates_config'
import { retrieveJobs_db } from '../utilities/database_utils'
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

    useEffect(() => {
        Object.keys(templatesConfig).map(key => retrieveJobs(key))
    }, [])

    const project_id = project._id
    const project_name = project.metadata_.project_name
    const street_address = project.data_.location?.street_address
        ? project.data_.location?.street_address + ', '
        : ''
    const city = project.data_.location?.city
        ? project.data_.location?.city + ', '
        : ''
    const state = project.data_.location?.state
        ? project.data_.location?.state + ' '
        : ''
    const zip_code = project.data_.location?.zip_code
        ? project.data_.location?.zip_code
        : ''
    const templates = Object.keys(templatesConfig).map(key => (
        <LinkContainer key={key} to={`/app/${project._id}/${key}`}>
            <ListGroup.Item key={key} action={true}>
                {templatesConfig[key as keyof typeof templatesConfig].title} ({workflowJobsCount[key]})
            </ListGroup.Item>
        </LinkContainer>
    ))
    return (
        <div>
            <center>
                <b>
                    <div>
                        <h3>{project_name}</h3>
                        {street_address}
                        {city}
                        {state} {'   '}
                        {zip_code}
                    </div>
                </b>
            </center>
            <br />
            <h1>Choose an Installation Workflow</h1>
            <ListGroup>{templates}</ListGroup>
        </div>
    )
}

export default WorkFlowView
