import React, { useEffect, useState } from 'react'
import { TfiTrash, TfiPlus } from 'react-icons/tfi'
import PouchDB from 'pouchdb'
import PouchDBUpsert from 'pouchdb-upsert'
import { Button, ListGroup, Modal } from 'react-bootstrap'
import templatesConfig from '../templates/templates_config'
import StringInputModal from './string_input_modal'
import { LinkContainer } from 'react-router-bootstrap'
import { putNewDoc, putNewWorkFlow } from '../utilities/database_utils'
import dbName from './db_details'

PouchDB.plugin(PouchDBUpsert)

interface JobListProps {
    workflowName: string
    projectID: any
}

const JobList: React.FC<JobListProps> = ({ workflowName, projectID }) => {
    const db = new PouchDB(projectID + '_' + workflowName)
    const [sortedJobs, setSortedJobs] = useState<any[]>([])
    const [, setJobsList] = useState<any[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [modalOpenMap, setModalOpenMap] = useState<{
        [jobId: string]: boolean
    }>({})
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [selectedJobToDelete, setSelectedJobToDelete] = useState('')
    const [projectInfo, setProjectInfo] = useState<any>({})

    const project_info = async (projectID: string, workflowName: string) => {
        const projectDB = new PouchDB(dbName)
        const doc = await projectDB.get(projectID)

        if (doc) {
            const project_name = doc?.project_name
            const installation_name = templatesConfig[workflowName].title
            const street_address = doc.data_.location?.street_address
                ? doc.data_.location?.street_address + ', '
                : null
            const city = doc.data_.location?.city
                ? doc.data_.location?.city + ', '
                : null
            const state = doc.data_.location?.state
                ? doc.data_.location?.state + ' '
                : null
            const zip_code = doc.data_.location?.zip_code
                ? doc.data_.location?.zip_code
                : null
            const project_details = {
                project_name: project_name,
                installation_name: installation_name,
                street_address: street_address,
                city: city,
                state: state,
                zip_code: zip_code,
            }
            setProjectInfo(project_details)
            return project_details
        }
    }

    project_info(projectID, workflowName)

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
                const regex = /^(?!.*\s\s)[a-zA-Z0-9, \-]{1,64}$/
                return regex.test(input)
            },
            errorMsg:
                'The project name must be no more than 64 characters consisting of letters, numbers, dashes, and single spaces. Single spaces can only appear between other characters.',
        },
        {
            validator: (input: string) => {
                // Not allow a duplicate with an existing job name
                return !sortedJobs.includes(input.trim())
            },
            errorMsg:
                'Job name already exists. Please choose a different name.',
        },
    ]

    const retrieveJobs = async (): Promise<void> => {
        try {
            const result = await db.allDocs({ include_docs: true })
            const jobsList = result.rows.map(row => row.doc)
            setJobsList(jobsList)
            sortByEditTime(jobsList)
        } catch (error) {
            console.error('Error retrieving jobs:', error)
        }
    }

    useEffect(() => {
        retrieveJobs()
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
        setSortedJobs(sortedJobsByEditTime.map(doc => doc._id))
    }

    const handleDeleteJob = (jobId: string) => {
        setSelectedJobToDelete(jobId)
        setShowDeleteConfirmation(true)
    }

    const confirmDeleteJob = async () => {
        try {
            const doc = await db.get(selectedJobToDelete)
            await db.remove(doc)
            // Refresh the job list after deletion
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
            await putNewDoc(db, docName)
            //await putNewWorkFlow(db, projectID, workflowName, docName)
        }
        // Refresh the job list after adding the new job
        await retrieveJobs()
    }

    const handleRenameJob = async (input: string, jobId: string) => {
        try {
            const newName = input
            if (newName !== null) {
                const doc = await db.get(jobId)
                await db.remove(doc) // Remove the existing document
                doc._id = newName // Set the new name as the ID
                if (doc.metadata_?.project_name)
                    doc.metadata_.project_name = input
                await db.putIfNotExists(doc)
            }

            // Refresh the job list after renaming
            await retrieveJobs()
        } catch (error) {
            console.error('Error renaming job:', error)
        }
    }

    return (
        <div className="container">
            <h1></h1>

            <h3>Installations</h3>
            <center>
                {projectInfo?.installation_name && (
                    <h2>{projectInfo?.installation_name}</h2>
                )}
                {projectInfo?.project_name && (
                    <>
                        {projectInfo?.project_name}
                        <br />
                    </>
                )}
                {projectInfo?.street_address && (
                    <b>{projectInfo?.street_address}</b>
                )}
                {projectInfo?.city && <b>{projectInfo?.city}</b>}
                {projectInfo?.state && <b>{projectInfo?.state} </b>}
                {projectInfo?.zip_code && <b>{projectInfo?.zip_code}</b>}
            </center>
            <br />

            <Button onClick={openAddModal}>
                <TfiPlus />
            </Button>
            <StringInputModal
                isOpen={isAddModalOpen}
                closeModal={closeAddModal}
                onSubmit={handleAddJob}
                validateInput={validateInput}
                title="Enter new installation name"
                okButton="Add"
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
                {sortedJobs.map(job => (
                    <>
                        <LinkContainer
                            to={`/app/${projectID}/${workflowName}/${job}`}
                        >
                            <ListGroup.Item action={true} key={job}>
                                {job}
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
                                            handleDeleteJob(job)
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
                            onSubmit={input => handleRenameJob(input, job)}
                            validateInput={validateInput}
                            title="Enter new installation name"
                            okButton="Rename"
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
                                {selectedJobToDelete}? This action cannot be
                                undone.
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
