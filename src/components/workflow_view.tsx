import { useState, type FC, useEffect } from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import templatesConfig, {
    mapMeasuresToTemplateValues,
} from '../templates/templates_config'
import {
    retrieveInstallationDocs,
    retrieveProjectSummary,
    useDB,
} from '../utilities/database_utils'
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

    const [allowedTemplates, setAllowedTemplates] = useState<string[]>([])

    // Load allowed templates based on mapped measure types from vapor-flow
    useEffect(() => {
        const measures = localStorage.getItem('measures') || '[]'

        try {
            const measureNames: string[] = JSON.parse(measures)
            //normalize measure names
            const normalized = measureNames.map(m => m.toLowerCase())
            // map normalized measures to template titles
            const mappedTitles = mapMeasuresToTemplateValues(normalized)
            setAllowedTemplates(mappedTitles)
        } catch (err) {
            console.warn('Failed to parse measures from localStorage:', err)
            setAllowedTemplates([])
        }
    }, [])

    // Retrieves the installation details with the specific workflow name
    const retrieveJobs = async (workflowName: string): Promise<void> => {
        retrieveInstallationDocs(db, projectId as string, workflowName).then(
            res => {
                setWorkflowJobsCount(prevArray => ({
                    ...prevArray,
                    [workflowName]: res.length,
                }))
            },
        )
    }
    const project_info = async (): Promise<void> => {
        // Retrieves the project information which includes project name and installation address
        retrieveProjectSummary(db, projectId as string, '').then((res: any) => {
            setProjectInfo(res)
        })
    }

    useEffect(() => {
        if (allowedTemplates.length === 0) return
        allowedTemplates.forEach(workflow => retrieveJobs(workflow))
        project_info()
    }, [allowedTemplates])

    const project_name = projectInfo?.project_name
        ? projectInfo?.project_name
        : ''
    const street_address = projectInfo?.street_address
        ? projectInfo?.street_address
        : ''
    const city = projectInfo?.city ? projectInfo?.city : ''
    const state = projectInfo?.state ? projectInfo?.state : ''
    const zip_code = projectInfo?.zip_code ? projectInfo?.zip_code : ''
    const templates = Object.entries(templatesConfig)
        .filter(([_, val]) => allowedTemplates.includes(val.title))
        .flatMap(([key, val]) => {
            const jobCount = workflowJobsCount[key] || 0

            // no jobs: show just the workflow
            if (jobCount === 0) {
                return [
                    <LinkContainer
                        key={`${key}-0`}
                        to={`/app/${projectId}/${key}`}
                    >
                        <ListGroup.Item action={true}>
                            {val.title}
                        </ListGroup.Item>
                    </LinkContainer>,
                ]
            }

            // one or more jobs: list each job with its own link
            return Array.from({ length: jobCount }).map((_, jobIndex) => (
                <LinkContainer
                    key={`${key}-${jobIndex}`}
                    to={`/app/${projectId}/${key}/${jobIndex}`}
                >
                    <ListGroup.Item action={true}>
                        {val.title} — Job {jobIndex + 1}
                    </ListGroup.Item>
                </LinkContainer>
            ))
        })

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