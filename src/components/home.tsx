import { useState, type FC, useEffect, useRef, SetStateAction } from 'react'
import { ListGroup, Button, Modal } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { putNewProject } from '../utilities/database_utils'
import PouchDB from 'pouchdb'
import { Tooltip } from 'react-tooltip'
import { TfiTrash, TfiPencil } from 'react-icons/tfi'
import dbName from './db_details'
import { retrieveProjectDocs } from '../utilities/database_utils'
import { useNavigate } from 'react-router-dom'

/**
 * Home:  Renders the Home page for the APP
 *
 * @returns ListGroup component displaying the projects created
 */
const Home: FC = () => {
    const db = new PouchDB(dbName)
    const navigate = useNavigate()
    const [projectList, setProjectList] = useState<any[]>([])
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [selectedProjectToDelete, setSelectedProjectToDelete] = useState('')
    const [selectedProjectNameToDelete, setSelectedProjectNameToDelete] =
        useState('')

    const retrieveProjectInfo = async (): Promise<void> => {
        retrieveProjectDocs(db).then(res => {
            setProjectList(res)
            sortByEditTime(res)
        })
    }

    const deleteEmptyProjects = async () => {
        try {
            const allDocs: any = await db.allDocs({ include_docs: true })

            const projectDocs: any = allDocs.rows
                .map((row: { doc: any }) => row.doc)
                .filter(
                    (doc: { metadata_: any; type: string }) =>
                        doc?.type === 'project' &&
                        doc?.metadata_?.doc_name === '' &&
                        doc?.metadata_?.status === 'new',
                )

            for (const doc of projectDocs) {
                // Remove the empty project document from the database
                await db.remove(doc)
            }
        } catch (error) {
            // Log any errors that occur during the process
            //console.error('', error)
        }
    }

    useEffect(() => {
        deleteEmptyProjects()
    }, [])

    useEffect(() => {
        retrieveProjectInfo()
    }, [projectList])

    const handleAddJob = async () => {
        // adding a new project doc here
        const updatedDBDoc: any = await putNewProject(db, '', '')

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

    const handleDelete = (
        event: React.MouseEvent,
        key: { _id: string; metadata_: { doc_name: SetStateAction<string> } },
    ) => {
        event.stopPropagation()
        event.preventDefault()
        handleDeleteJob(key._id)
        setSelectedProjectNameToDelete(key.metadata_?.doc_name)
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
    }

    const cancelDeleteJob = () => {
        setShowDeleteConfirmation(false)
        setSelectedProjectToDelete('')
    }

    const editAddressDetails = (projectID: string) => {
        navigate('app/' + projectID, { replace: true })
    }
    let projects_display: any = ''
    if (Object.keys(projectList).length == 0) {
        projects_display = (
            <center>
                <br />
                <p className="welcome-header">
                    Welcome to the Quality Install Tool
                </p>
                <br />
                <p className="welcome-content">
                    With this tool you will be able <br /> to easily take photos
                    and document <br />
                    your entire installation project. <br />
                    <br />
                    <br />
                    For your record
                    <br />
                    For your clients
                    <br />
                    For reporting to the state
                </p>
                <div className="button-container-center" key={0}>
                    <Button onClick={handleAddJob} alt-text="Add a New Project">
                        Add a New Project
                    </Button>
                    <Tooltip anchorSelect=".add-project" place="top">
                        Add a New Project
                    </Tooltip>
                </div>
            </center>
        )
    } else {
        projects_display = [
            <div key={0}>
                <div className="button-container-right">
                    <Button onClick={handleAddJob} alt-text="Add a New Project">
                        Add a New Project
                    </Button>
                </div>
                <br />
                <br />
            </div>,
            projectList.map((key, value) => (
                <div key={key._id}>
                    <ListGroup key={key._id} className="padding">
                        <LinkContainer
                            key={key}
                            to={`/app/${key._id}/workflows`}
                        >
                            <ListGroup.Item key={key._id} action={true}>
                                <span className="icon-container">
                                    {/* <Menu options={options} /> */}

                                    <Button
                                        variant="light"
                                        onClick={event => {
                                            event.stopPropagation()
                                            event.preventDefault()
                                            editAddressDetails(key._id)
                                        }}
                                    >
                                        <TfiPencil />
                                    </Button>
                                    <Tooltip
                                        anchorSelect=".edit"
                                        place="bottom"
                                    >
                                        Edit
                                    </Tooltip>
                                    <Button
                                        variant="light"
                                        onClick={event =>
                                            handleDelete(event, key)
                                        }
                                    >
                                        <TfiTrash />
                                    </Button>
                                    <Tooltip
                                        anchorSelect=".delete"
                                        place="bottom"
                                    >
                                        Delete
                                    </Tooltip>
                                </span>
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
                            </ListGroup.Item>
                        </LinkContainer>
                    </ListGroup>
                </div>
            )),
        ]
    }
    return (
        <>
            {projects_display}
            <br />
            <center>
                <p className="welcome-content">
                    <br />
                    Click here to learn more about the{' '}
                    <a
                        href="https://www.pnnl.gov/projects/quality-install-tool"
                        target="_blank"
                    >
                        Quality Install Tool
                    </a>
                </p>
            </center>
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
        </>
    )
}

export default Home
