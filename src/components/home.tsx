import { useState, type FC, useEffect } from 'react'
import { ListGroup, Button, Modal } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { putNewProject } from '../utilities/database_utils'
import PouchDB from 'pouchdb'
import { TfiPlus, TfiTrash } from 'react-icons/tfi'
import StringInputModal from './string_input_modal'
import dbName from './db_details'
import { retrieveProjects } from '../utilities/database_utils'

/**
 * Home:  Renders the Home page for the APP
 *
 * @returns ListGroup component displaying the projects created
 */
const Home: FC = () => {
    const db = new PouchDB(dbName)

    const [sortedProjectList, setSortedProjectList] = useState<any[]>([])
    const [projectList, setProjectList] = useState<any[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [modalOpenMap, setModalOpenMap] = useState<{
        [docId: string]: boolean
    }>({})
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [selectedProjectToDelete, setSelectedProjectToDelete] = useState('')
    const [selectedProjectNameToDelete, setSelectedProjectNameToDelete] =
        useState('')

    const openAddModal = (): void => {
        setIsAddModalOpen(true)
    }
    const closeAddModal = (): void => {
        setIsAddModalOpen(false)
    }

    const retrieveProjectInfo = async (): Promise<void> => {
        retrieveProjects(db).then(res => {
            setProjectList(res)
            sortByEditTime(res)
        })
    }

    useEffect(() => {
        retrieveProjectInfo()
    }, [])

    const validateInput = [
        {
            validator: (input: string) => {
                // Restrict the character set to [a-zA-Z0-9-_#:>]
                //const regex = /^(?!.*\s\s)[a-zA-Z0-9, \-]{1,64}$/
                const regex = /^(?![\s-])[a-zA-Z0-9, \-]{1,64}$/
                return regex.test(input)
            },
            errorMsg:
                'The project name must be no more than 64 characters consisting of letters, numbers, dashes, and single spaces. Single spaces can only appear between other characters.',
        },
        {
            validator: (input: string) => {
                // Not allow a duplicate with an existing job name
                const projectNames: string[] = []
                sortedProjectList.map((key, value) => {
                    projectNames.push(key._id)
                })
                return !projectNames.includes(input.trim())
            },
            errorMsg:
                'Project name already exists. Please choose a different name.',
        },
    ]

    const handleAddJob = async (input: string) => {
        // adding a new job here
        const docName = input

        const updatedDBDoc: any =
            docName !== null ? await putNewProject(db, docName, '') : ''

        // Refresh the job list after adding the new job
        await retrieveProjectInfo()
        if (updatedDBDoc) editAddressDetails(updatedDBDoc.id)
    }

    const handleDeleteJob = (jobId: string) => {
        setSelectedProjectToDelete(jobId)
        setShowDeleteConfirmation(true)
    }

    const confirmDeleteJob = async () => {
        try {
            const doc = await db.get(selectedProjectToDelete)
            await db.remove(doc)
            // Refresh the job list after deletion
            await retrieveProjectInfo()
        } catch (error) {
            console.error('Error deleting job:', error)
        } finally {
            setShowDeleteConfirmation(false)
            setSelectedProjectToDelete('')
        }
    }

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
        setSortedProjectList(sortedJobsByEditTime.map(doc => doc._id))
    }

    const cancelDeleteJob = () => {
        setShowDeleteConfirmation(false)
        setSelectedProjectToDelete('')
    }

    const editAddressDetails = (projectID: string) => {
        window.location.replace('/app/' + projectID)
    }

    const handleRenameProject = async (input: string, docId: string) => {
        try {
            if (input !== null) {
                await db.upsert(docId, function (doc) {
                    doc.metadata_.project_name = input
                    return doc
                })
            }
            // Refresh the job list after renaming
            await retrieveProjectInfo()
        } catch (error) {
            console.error('Error renaming job:', error)
        }
    }

    let title = 'Projects List'
    let projects_display: any = ''
    if (Object.keys(projectList).length == 0) {
        projects_display = (
            <Button onClick={openAddModal}>Create a project</Button>
        )
        title = 'Welcome to Quality Install Tool'
    } else {
        projects_display = projectList.map((key, value) => (
            <ListGroup key={key}>
                <LinkContainer key={key} to={`/app/${key._id}/workflows`}>
                    <ListGroup.Item key={key._id} action={true}>
                        <b>{key.metadata_?.project_name}</b>
                        {key.data_.location?.street_address && (
                            <>
                                <br />
                                {key.data_.location?.street_address},
                            </>
                        )}
                        {key.data_.location?.city && (
                            <>
                                <br />
                                {key.data_.location?.city},{' '}
                            </>
                        )}
                        {key.data_.location?.state && (
                            <>{key.data_.location?.state} </>
                        )}
                        {key.data_.location?.zip_code && (
                            <>{key.data_.location?.zip_code}</>
                        )}

                        <span className="icon-container">
                            <Button
                                onClick={event => {
                                    event.stopPropagation()
                                    event.preventDefault()
                                    setModalOpenMap(prevState => ({
                                        ...prevState,
                                        [key._id]: true,
                                    }))
                                }}
                            >
                                Rename
                            </Button>
                            <Button
                                onClick={event => {
                                    event.stopPropagation()
                                    event.preventDefault()
                                    editAddressDetails(key._id)
                                }}
                            >
                                Add / Edit Address
                            </Button>
                            <Button
                                onClick={event => {
                                    event.stopPropagation()
                                    event.preventDefault()
                                    handleDeleteJob(key._id)
                                    setSelectedProjectNameToDelete(
                                        key.metadata_?.project_name,
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
                    isOpen={modalOpenMap[key._id] || false}
                    closeModal={() => {
                        setModalOpenMap(prevState => ({
                            ...prevState,
                            [key._id]: false,
                        }))
                    }}
                    onSubmit={input => handleRenameProject(input, key._id)}
                    validateInput={validateInput}
                    title="Enter new project name"
                    okButton="Rename"
                    value={key.metadata_?.project_name}
                />
            </ListGroup>
        ))
    }
    return (
        <div>
            <h1>{title}</h1>

            {projects_display}
            <br />
            {Object.keys(projectList).length != 0 && (
                <center>
                    <Button onClick={openAddModal}>Add a New Project</Button>
                </center>
            )}

            <StringInputModal
                isOpen={isAddModalOpen}
                closeModal={closeAddModal}
                onSubmit={handleAddJob}
                validateInput={validateInput}
                title="Enter new project name"
                okButton="Add"
                value=""
            />

            <Modal show={showDeleteConfirmation} onHide={cancelDeleteJob}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to permanently delete{' '}
                    <b>{selectedProjectNameToDelete}</b>? This action cannot be
                    undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDeleteJob}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteJob}>
                        Permanently Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Home
