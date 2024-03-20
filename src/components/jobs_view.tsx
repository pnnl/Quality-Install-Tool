import React, { useEffect, useState } from 'react'
import { TfiTrash, TfiPlus } from 'react-icons/tfi'
import PouchDB from 'pouchdb'
import PouchDBUpsert from 'pouchdb-upsert'
import { Button, ListGroup, Modal } from 'react-bootstrap'
import templatesConfig from '../templates/templates_config'
import StringInputModal from './string_input_modal'
import { LinkContainer } from 'react-router-bootstrap'
import {
    putNewDoc,
    putNewWorkFlow,
    retrieveJobs_db,
    retrieveProjectSummary,
} from '../utilities/database_utils'
import dbName from './db_details'

PouchDB.plugin(PouchDBUpsert)

interface JobListProps {
    workflowName: string
    docId: any
}

/**
 * A component view to list installations for a Project.
 *
 * @param workflowName - The workflow name associated with an MDX template.
 * @param docId - A projectID (or docId) for respective project doc in pouchDB.
 *                This ID is used to retrieve data related to the project and its installations.
 */
const JobList: React.FC<JobListProps> = ({ workflowName, docId }) => {
    const db = new PouchDB(dbName)
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
        retrieveProjectSummary(db, docId, workflowName).then(res => {
            setProjectInfo(res)
        })
    }

    const installation_name = templatesConfig[workflowName].title

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
                'The project name must be no more than 64 characters consisting of letters, numbers, dashes, and single spaces. Single spaces can only appear between other characters.',
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
        retrieveJobs_db(db, docId, workflowName).then(res => {
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
            const projectDoc = await db.get(docId)
            // Remove the existing document
            //await db.remove(projectDoc)
            await db.upsert(docId, function (projectDoc) {
                let del_index = -1
                projectDoc.installations_.map(
                    async (key: any, workflow_name: string, value: number) => {
                        if (
                            key.metadata_.workflow_name == workflowName &&
                            key._id == selectedJobToDelete
                        ) {
                            del_index = value
                        }
                    },
                )
                projectDoc.installations_.splice(del_index, 1)
                return projectDoc
            })
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
            //await putNewDoc(db, docName)
            await putNewWorkFlow(db, docId, workflowName, '', docName)
        }
        // Refresh the job list after adding the new job
        await retrieveJobs()
    }

    const handleRenameJob = async (input: string, jobId: string) => {
        try {
            if (input !== null) {
                const projectDoc = await db.get(docId)

                await db.upsert(docId, function (projectDoc) {
                    projectDoc.installations_.map(
                        async (key: any, workflow_name: string) => {
                            if (
                                key.metadata_.workflow_name == workflowName &&
                                key._id == jobId
                            ) {
                                key.metadata_.doc_name = input
                            }
                        },
                    )
                    return projectDoc
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
            <h3>
                {projectInfo?.street_address && (
                    <>{projectInfo?.street_address}</>
                )}
                {projectInfo?.city && <>{projectInfo?.city}</>}
                {projectInfo?.state && <>{projectInfo?.state} </>}
                {projectInfo?.zip_code && <>{projectInfo?.zip_code}</>}
            </h3>

            <br />

            <Button onClick={openAddModal}>Add Installation</Button>
            <StringInputModal
                isOpen={isAddModalOpen}
                closeModal={closeAddModal}
                onSubmit={handleAddJob}
                validateInput={validateInput}
                title="Enter new installation name"
                okButton="Add"
                value=""
            />
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

            <ListGroup>
                {sortedJobs.map((jobID, job) => (
                    <>
                        <LinkContainer
                            key={jobID._id}
                            to={`/app/${docId}/${workflowName}/${jobID._id}`}
                        >
                            <ListGroup.Item action={true} key={jobID._id}>
                                {jobID.metadata_.doc_name}
                                <span className="icon-container">
                                    <Button
                                        onClick={event => {
                                            event.stopPropagation()
                                            event.preventDefault()
                                            setModalOpenMap(prevState => ({
                                                ...prevState,
                                                [job]: true,
                                            }))
                                        }}
                                    >
                                        Rename
                                    </Button>

                                    <Button
                                        onClick={event => {
                                            event.stopPropagation()
                                            event.preventDefault()
                                            handleDeleteJob(jobID._id)
                                            setSelectedJobNameToDelete(
                                                jobID.metadata_.doc_name,
                                            )
                                        }}
                                        variant="danger"
                                    >
                                        <TfiTrash />
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
                            onSubmit={input =>
                                handleRenameJob(input, jobID._id)
                            }
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
                                <b>{selectedJobNameToDelete}</b>? This action
                                cannot be undone.
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="secondary"
                                    onClick={cancelDeleteJob}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={confirmDeleteJob}
                                >
                                    Permanently Delete
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                ))}
            </ListGroup>
        </div>
    )
}

export default JobList
