import React, { lazy, Suspense, useEffect, useState } from 'react'
import { TfiTrash, TfiPencil } from 'react-icons/tfi'
import PouchDB from 'pouchdb'
import PouchDBUpsert from 'pouchdb-upsert'
import { Button, ListGroup, Modal } from 'react-bootstrap'
import templatesConfig from '../templates/templates_config'
import { LinkContainer } from 'react-router-bootstrap'
import { useParams } from 'react-router-dom'
import { useDB } from '../utilities/database_utils'

const StringInputModal = lazy(() => import('./string_input_modal'))

PouchDB.plugin(PouchDBUpsert)

/**
 * A component view to list installations for a Project.
 * @returns ListGroup component displaying the jobs or installations associated with the project
 */
const JobList: React.FC = () => {
    const db = useDB()

    const { projectId, workflowName } = useParams()
    const [sortedJobs, setSortedJobs] = useState<any[]>([])
    const [sortedJobNames, setSortedJobNames] = useState<any[]>([])
    const [jobsList, setJobsList] = useState<any[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [modalOpenMap, setModalOpenMap] = useState<{
        [jobId: string]: boolean
    }>({})
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [selectedJobToDelete, setSelectedJobToDelete] = useState('')
    const [selectedJobNameToDelete, setSelectedJobNameToDelete] = useState('')

    const [projectInfo, setProjectInfo] = useState<any>({})

    // Retrieves the project information which includes project name and installation address
    const project_info = async (): Promise<void> => {
        // Dynamically import the function when needed
        const { retrieveProjectSummary } = await import(
            '../utilities/database_utils'
        )
        retrieveProjectSummary(
            db,
            projectId as string,
            workflowName as string,
        ).then(res => {
            setProjectInfo(res)
        })
    }

    const installation_name = templatesConfig[workflowName as string].title

    const openAddModal = (): void => {
        setIsAddModalOpen(true)
    }

    const closeAddModal = (): void => {
        setIsAddModalOpen(false)
    }

    const validateInput = [
        {
            validator: (input: string) => {
                // Restrict the character set to [a-zA-Z0-9-_#:>]
                const regex = /^(?![\s-])[a-zA-Z0-9, \-]{1,64}$/
                return regex.test(input)
            },
            errorMsg:
                'The job or task name must be no more than 64 characters consisting of letters, numbers, dashes, and single spaces. Single spaces can only appear between other characters.',
        },
        {
            validator: (input: string) => {
                // Not allow a duplicate with an existing job nam
                return !sortedJobNames.includes(input.trim())
            },
            errorMsg:
                'Job name already exists. Please choose a different name.',
        },
    ]

    const retrieveJobs = async (): Promise<void> => {
        // Dynamically import the function when needed
        const { retrieveInstallationDocs } = await import(
            '../utilities/database_utils'
        )
        retrieveInstallationDocs(
            db,
            projectId as string,
            workflowName as string,
        ).then(res => {
            setJobsList(res)
            sortByEditTime(res)
        })
    }

    useEffect(() => {
        retrieveJobs()
        project_info()
    }, [])

    const sortByEditTime = (jobsList: any[]) => {
        const sortedJobsByEditTime = jobsList.sort((a, b) => {
            if (
                a.metadata_.last_modified_at.toString() <
                b.metadata_.last_modified_at.toString()
            ) {
                return 1
            } else if (
                a.metadata_.last_modified_at.toString() >
                b.metadata_.last_modified_at.toString()
            ) {
                return -1
            } else {
                return 0
            }
        })
        setSortedJobs(sortedJobsByEditTime)
        setSortedJobNames(
            sortedJobsByEditTime.map(doc => doc.metadata_.doc_name),
        )
    }

    const handleDeleteJob = (jobId: string) => {
        setSelectedJobToDelete(jobId)
        setShowDeleteConfirmation(true)
    }

    const confirmDeleteJob = async () => {
        try {
            const projectDoc = await db.get(selectedJobToDelete)
            await db.remove(projectDoc)
            await retrieveJobs()
        } catch (error) {
            console.error('Error deleting job:', error)
        } finally {
            setShowDeleteConfirmation(false)
            setSelectedJobToDelete('')
        }
    }

    const cancelDeleteJob = () => {
        setShowDeleteConfirmation(false)
        setSelectedJobToDelete('')
    }

    const handleAddJob = async (input: string) => {
        // adding a new job here
        const docName = input
        if (docName !== null) {
            // Dynamically import the function when needed
            const { putNewInstallation } = await import(
                '../utilities/database_utils'
            )
            await putNewInstallation(
                db,
                '',
                workflowName as string,
                docName,
                projectId as string,
            )
        }
        // Refresh the job list after adding the new job
        await retrieveJobs()
    }

    const handleRenameJob = async (input: string, jobId: string) => {
        try {
            if (input !== null) {
                await db.upsert(jobId, function (doc: any) {
                    doc.metadata_.doc_name = input
                    return doc
                })
            }
            // Refresh the job list after renaming
            await retrieveJobs()
        } catch (error) {
            console.error('Error renaming job:', error)
        }
    }

    return (
        <div className="container">
            <h1>{installation_name}</h1>
            <h2>
                Installations for{' '}
                {projectInfo?.project_name && (
                    <>
                        {projectInfo?.project_name}
                        <br />
                    </>
                )}
            </h2>
            <ListGroup className="address">
                {projectInfo?.street_address && (
                    <>{projectInfo?.street_address}</>
                )}
                {projectInfo?.city && <>{projectInfo?.city}</>}
                {projectInfo?.state && <>{projectInfo?.state} </>}
                {projectInfo?.zip_code && <>{projectInfo?.zip_code}</>}
            </ListGroup>

            <br />

            <Button variant="primary" onClick={openAddModal}>
                Add Installation
            </Button>
            <Suspense fallback={<div>Loading...</div>}>
                <StringInputModal
                    isOpen={isAddModalOpen}
                    closeModal={closeAddModal}
                    onSubmit={handleAddJob}
                    validateInput={validateInput}
                    title="Enter new installation name"
                    okButton="Add"
                    value=""
                />
            </Suspense>
            <div className="bottom-margin"></div>
            {/* Sort feature, not used now but will be used in future. */
            /* <Dropdown>
        <Dropdown.Toggle variant="success">
          <TfiFilter/>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={event => {sortByCreateTime(jobsList)}}>
            Sort By Created Date
          </Dropdown.Item>
          <Dropdown.Item onClick={event => {sortByEditTime(jobsList)}}>
            Sort By Edit Date
          </Dropdown.Item> 
        </Dropdown.Menu>
      </Dropdown> */}

            {sortedJobs.map((jobID, job) => (
                <ListGroup key={jobID._id}>
                    <LinkContainer
                        key={jobID._id}
                        to={`/app/${projectId}/${workflowName}/${jobID._id}`}
                    >
                        <ListGroup.Item action={true} key={jobID._id}>
                            {jobID.metadata_.doc_name}
                            <span className="icon-container">
                                <Button
                                    variant="light"
                                    onClick={event => {
                                        event.stopPropagation()
                                        event.preventDefault()
                                        setModalOpenMap(prevState => ({
                                            ...prevState,
                                            [job]: true,
                                        }))
                                    }}
                                >
                                    <TfiPencil size={22} />
                                </Button>

                                <Button
                                    variant="light"
                                    onClick={event => {
                                        event.stopPropagation()
                                        event.preventDefault()
                                        handleDeleteJob(jobID._id)
                                        setSelectedJobNameToDelete(
                                            jobID.metadata_.doc_name,
                                        )
                                    }}
                                >
                                    <TfiTrash size={22} />
                                </Button>
                            </span>
                        </ListGroup.Item>
                    </LinkContainer>
                    <StringInputModal
                        isOpen={modalOpenMap[job] || false}
                        closeModal={() => {
                            setModalOpenMap(prevState => ({
                                ...prevState,
                                [job]: false,
                            }))
                        }}
                        onSubmit={input => handleRenameJob(input, jobID._id)}
                        validateInput={validateInput}
                        title="Enter new installation name"
                        okButton="Rename"
                        value={jobID.metadata_.doc_name}
                    />

                    <Modal
                        show={showDeleteConfirmation}
                        onHide={cancelDeleteJob}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to permanently delete{' '}
                            <b>{selectedJobNameToDelete}</b>? This action cannot
                            be undone.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={cancelDeleteJob}
                            >
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={confirmDeleteJob}>
                                Permanently Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </ListGroup>
            ))}
        </div>
    )
}

export default JobList
