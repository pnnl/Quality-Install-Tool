import { useState, type FC, useEffect, useMemo } from 'react'
import { ListGroup, Button, Modal } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { putNewProject } from '../utilities/database_utils'
import PouchDB from 'pouchdb'
import { TfiPlus, TfiTrash } from 'react-icons/tfi'
import StringInputModal from './string_input_modal'
import dbName from './db_details'
import { retrieveProjectDocs } from '../utilities/database_utils'
import { useNavigate } from 'react-router-dom'

/**
 * Home:  Renders the Home page for the APP
 *
 * @returns ListGroup component displaying the projects created
 */
const Home: FC = () => {
    const db = useMemo(() => new PouchDB(dbName), [])
    const navigate = useNavigate()
    const [path, setPath] = useState<string>(window.location.href.split('?')[1])
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
        retrieveProjectDocs(db).then(res => {
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
                // Not allow a duplicate with an existing project name
                const projectNames: string[] = []
                sortedProjectList.map((key, value) => {
                    projectNames.push(key)
                })
                return !projectNames.includes(input.trim())
            },
            errorMsg:
                'Project name already exists. Please choose a different name.',
        },
    ]

    const handleAddJob = async (input: string) => {
        // adding a new project doc here
        const docName = input
        const updatedDBDoc: any =
            docName !== null ? await putNewProject(db, docName, '') : ''

        // Refresh the project list after adding the new project
        await retrieveProjectInfo()
        if (updatedDBDoc) editAddressDetails(updatedDBDoc.id)
    }

    const handleDeleteJob = (docId: string) => {
        setSelectedProjectToDelete(docId)
        setShowDeleteConfirmation(true)
    }

    const confirmDeleteJob = async () => {
        try {
            // delete the selected project
            const projectDoc: any = await db.get(selectedProjectToDelete)

            const installDocs: any = await db.allDocs({
                keys: projectDoc.children,
                include_docs: true,
            })

            // Filter jobs/installations linked to the projects and mark for deletion
            const docsToDelete: any = installDocs.rows
                .filter((row: { doc: any }) => !!row.doc) // Filter out rows without a document
                .map((row: { doc: { _id: any; _rev: any } }) => ({
                    _deleted: true,
                    _id: row.doc?._id,
                    _rev: row.doc?._rev,
                }))

            // performing bulk delete of jobs/installation doc
            if (docsToDelete.length > 0) {
                const deleteResult = await db.bulkDocs(docsToDelete)
            }
            // Deleting the project document
            await db.remove(projectDoc)

            //Refresh the project list after deletion
            await retrieveProjectInfo()
        } catch (error) {
            console.error('Error deleting project doc:', error)
        } finally {
            setShowDeleteConfirmation(false)
            setSelectedProjectToDelete('')
        }
    }

    const sortByEditTime = (projectsList: any[]) => {
        const sortedJobsByEditTime = projectsList.sort((a, b) => {
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
        setSortedProjectList(
            sortedJobsByEditTime.map(doc => doc.metadata_.doc_name),
        )
    }

    const cancelDeleteJob = () => {
        setShowDeleteConfirmation(false)
        setSelectedProjectToDelete('')
    }

    const editAddressDetails = (projectID: string) => {
        navigate('app/' + projectID, { replace: true })
    }

    const handleRenameProject = async (input: string, docId: string) => {
        try {
            if (input !== null) {
                await db.upsert(docId, function (doc: any) {
                    doc.metadata_.doc_name = input
                    return doc
                })
            }
            // Refresh the project list after renaming
            await retrieveProjectInfo()
        } catch (error) {
            console.error('Error renaming project doc:', error)
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
            <ListGroup key={key._id} className="padding">
                <LinkContainer key={key} to={`/app/${key._id}/workflows`}>
                    <ListGroup.Item key={key._id} action={true}>
                        <b>{key.metadata_?.doc_name}</b>
                        {key.data_?.location?.street_address && (
                            <>
                                <br />
                                {key.data_?.location?.street_address},
                            </>
                        )}
                        {key.data_?.location?.city && (
                            <>
                                <br />
                                {key.data_?.location?.city},{' '}
                            </>
                        )}
                        {key.data_.location?.state && (
                            <>{key.data_?.location?.state} </>
                        )}
                        {key.data_.location?.zip_code && (
                            <>{key.data_?.location?.zip_code}</>
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
                                        key.metadata_?.doc_name,
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
                    value={key.metadata_?.doc_name}
                />
            </ListGroup>
        ))
    }
    return (
        <div>
            <h1>{title}</h1>
            <ListGroup>{projects_display}</ListGroup>
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
