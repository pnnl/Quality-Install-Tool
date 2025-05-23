import { useState, type FC, useEffect } from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import templatesConfig, {
    mapMeasuresToTemplateValues,
    measureTypeMapping,
    reverseTemplateMap,
} from '../templates/templates_config'
import {
    retrieveInstallationDocs,
    retrieveProjectSummary,
    useDB,
} from '../utilities/database_utils'
import { useParams } from 'react-router-dom'
import { getConfig } from '../config'

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

    const VAPORCORE_URL = getConfig('REACT_APP_VAPORCORE_URL')

    // Load allowed templates based on mapped measure types from vapor-flow, filter out completed measures
    useEffect(() => {
        const checkCompletedMeasuresAndFilter = async () => {
            const measures = localStorage.getItem('measures') || '[]'
            const userId = localStorage.getItem('user_id')
            const processStepId = localStorage.getItem('process_step_id')
            const processId = localStorage.getItem('process_id')

            try {
                const measureNames: string[] = JSON.parse(measures)
                const normalized = measureNames.map(m => m.toLowerCase())

                if (!userId || !processStepId || !processId) {
                    console.warn(
                        'Missing identifiers for checking measure status',
                    )
                    setAllowedTemplates(mapMeasuresToTemplateValues(normalized))
                    return
                }

                const res = await fetch(
                    `${VAPORCORE_URL}/api/process/${processId}/step/${processStepId}/form-data?user_id=${userId}`,
                    { method: 'GET' },
                )
                const json = await res.json()

                const completedTitles: string[] =
                    json?.data?.measures
                        ?.filter((m: any) =>
                            m.jobs?.some(
                                (job: any) =>
                                    job.status?.toLowerCase() === 'completed',
                            ),
                        )
                        .map((m: any) => m.name.trim().toLowerCase()) || []

                console.log('[Completed Titles]', completedTitles)

                // remove any measure key that maps to any completed template title
                const remainingMeasureKeys = normalized.filter(measureKey => {
                    const mappedTitles = measureTypeMapping[measureKey] || []
                    return !mappedTitles.some(title =>
                        completedTitles.includes(title.trim().toLowerCase()),
                    )
                })

                console.log('[Remaining Measure Keys]', remainingMeasureKeys)

                const filteredTitles =
                    mapMeasuresToTemplateValues(remainingMeasureKeys)

                console.log('[Remaining Titles]', filteredTitles)
                setAllowedTemplates(filteredTitles)
            } catch (err) {
                console.warn('Failed to filter completed measures:', err)
                setAllowedTemplates([])
            }
        }

        checkCompletedMeasuresAndFilter()
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
