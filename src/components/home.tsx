import React, { useEffect, useState } from 'react'
import { ListGroup, Button, Modal } from 'react-bootstrap'
import { TfiTrash, TfiPencil } from 'react-icons/tfi'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'

import ExportDoc from './export_document'
import ImportDoc from './import_document'
import {
    getProjects,
    removeEmptyProjects,
    removeProject,
    useDB,
} from '../utilities/database_utils'

interface HomeProps {}

/**
 * Home:  Renders the Home page for the APP
 *
 * @returns ListGroup component displaying the projects created
 */
const Home: React.FC<HomeProps> = () => {
    const navigate = useNavigate()
    const [projectList, setProjectList] = useState<any[]>([])
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [selectedProjectToDelete, setSelectedProjectToDelete] = useState('')
    const [selectedProjectNameToDelete, setSelectedProjectNameToDelete] =
        useState('')
    const db = useDB()

    const retrieveProjectInfo = async (): Promise<void> => {
        getProjects(db).then(res => {
            setProjectList(res)
            sortByEditTime(res)
        })
    }

    useEffect(() => {
        removeEmptyProjects(db)
    }, [])

    useEffect(() => {
        retrieveProjectInfo()
    }, [projectList]) // Fetch the project details from DB as the state variable projectList is updated

    const handleAddJob = async () => {
        // Dynamically import the function when needed
        const { putNewProject } = await import('../utilities/database_utils')
        const updatedDBDoc: any = await putNewProject(db, '', undefined)

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
            // delete the selected project and associated installations
            await removeProject(db, selectedProjectToDelete)

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
        key: { _id: string; metadata_: { doc_name: string } },
    ) => {
        event.stopPropagation()
        event.preventDefault()
        handleDeleteJob(key._id)
        setSelectedProjectNameToDelete(key.metadata_?.doc_name)
    }

    const sortByEditTime = (jobsList: any[]) => {
        jobsList.sort((a, b) => {
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

    const projects_display =
        Object.keys(projectList).length === 0
            ? []
            : projectList.map((key, value) => (
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
                                          <TfiPencil size={22} />
                                      </Button>
                                      <Button
                                          variant="light"
                                          onClick={event =>
                                              handleDelete(event, key)
                                          }
                                      >
                                          <TfiTrash size={22} />
                                      </Button>
                                      <ExportDoc
                                          projectId={key._id}
                                          includeInstallations={true}
                                      />
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
              ))

    return (
        <>
            <div>
                {Object.keys(projectList).length == 0 && (
                    <center>
                        <br />
                        <p className="welcome-header">
                            Welcome to the Quality Install Tool
                        </p>
                        <br />
                        <p className="welcome-content">
                            With this tool you will be able <br /> to easily
                            take photos and document <br />
                            your entire installation project. <br />
                            <br />
                            <br />
                            For your records
                            <br />
                            For your clients
                            <br />
                            For quality assurance reporting
                        </p>
                        <div className="button-container-center" key={0}>
                            <Button
                                onClick={handleAddJob}
                                alt-text="Add a New Project"
                            >
                                Add a New Project
                            </Button>
                            &nbsp;&nbsp;
                            <ImportDoc label="Import a Project" />
                        </div>
                    </center>
                )}
                {Object.keys(projectList).length > 0 && (
                    <div>
                        <div className="align-right padding">
                            <Button
                                onClick={handleAddJob}
                                alt-text="Add a New Project"
                            >
                                Add a New Project
                            </Button>
                            &nbsp;&nbsp;
                            <ImportDoc label="Import Project" />
                        </div>
                        {projects_display}
                    </div>
                )}
            </div>
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
