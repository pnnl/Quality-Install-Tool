import React, { useState, useEffect } from 'react'
import {
    Form,
    Button,
    FloatingLabel,
    Dropdown,
    DropdownButton,
} from 'react-bootstrap'
import { US_STATES } from './us_state_select_wrapper'
import { useDB } from '../utilities/database_utils'
import { useLocation, useNavigate } from 'react-router-dom'
import PhotoInputWrapper from './photo_input_wrapper' // Import the PhotoInputWrapper component
import { StoreProvider, StoreContext } from './store'
import { retrieveProjectDocs } from '../utilities/database_utils'
interface Project {
    type: string
    data_: Record<string, any>
    metadata_: {
        doc_name: string
        created_at: string
        last_modified_at: string
        attachments: Record<string, any>
        status: string
    }
    children: any[]
    _id: string
    _rev: string
}

const NewProjectForm = () => {
    const navigate = useNavigate()
    const { docId } = React.useContext(StoreContext) // Access the context to get docId
    const [projectDocs, setProjectDocs] = useState<Project[]>([])
    const [docName, setDocName] = useState('')
    const [docNameError, setDocNameError] = useState('')
    const [formData, setFormData] = useState<any>({})
    const [docStatus, setDocStatus] = useState<string>('')
    const [selectedProject, setSelectedProject] = useState<any>()
    const db = useDB()

    // Get projectDocs
    const retrieveProjectInfo = async (): Promise<void> => {
        try {
            const res = await retrieveProjectDocs(db)
            setProjectDocs(res)
            const selectedProject = lastModifiedProject(res)
            setSelectedProject(selectedProject)
        } catch (error) {
            console.error('Error retrieving project docs:', error)
        }
    }

    useEffect(() => {
        retrieveProjectInfo()
    }, [db])

    const lastModifiedProject = (projectDocs: Project[]) => {
        // Filter out projects with status "created"
        const filteredProjects = projectDocs.filter(
            project => project.metadata_.status !== 'new',
        )
        // Reduce the filtered list to find the project with the latest modified date
        return filteredProjects.reduce((latest, project) => {
            const latestDate = new Date(latest.metadata_.last_modified_at)
            const currentDate = new Date(project.metadata_.last_modified_at)
            return currentDate > latestDate ? project : latest
        })
    }

    useEffect(() => {
        const fetchProjectDoc = async () => {
            if (docId) {
                try {
                    const doc = await db.get(docId)
                    setFormData(doc.data_)
                    setDocName(doc.metadata_.doc_name)
                    setDocStatus(doc.metadata_.status)
                } catch (error) {
                    console.error('Error fetching document:', error)
                }
            }
        }
        fetchProjectDoc()
    }, [docId, db])

    // Update form data when a new project is selected
    useEffect(() => {
        if (selectedProject) {
            setFormData(selectedProject.data_)
            setDocName(selectedProject.metadata_.doc_name)
            setDocStatus(selectedProject.metadata_.status)
        }
    }, [selectedProject])

    const deleteEmptyProject = async () => {
        try {
            if (docStatus === 'new') {
                const projectDoc: any = await db.get(docId)
                if (projectDoc) {
                    db.remove(projectDoc)
                    setDocStatus('deleted')
                }
            }
        } catch (error) {
            console.error('Error in discarding the empty project:', error)
        } finally {
            navigate('/', { replace: true })
        }
    }

    const handleCancelButtonClick = async (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        if (docStatus === 'created') {
            navigate('/', { replace: true })
            return
        }
        deleteEmptyProject()
    }

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // stops the page refresh
        if (validateDocName(docName)) {
            const form = e.target as HTMLFormElement
            const formData = new FormData(form)
            const updates = {
                'metadata_.doc_name': formData.get('doc_name'),
                'data_.installer.technician_name':
                    formData.get('technician_name'),
                'data_.installer.company_name': formData.get(
                    'installation_company',
                ),
                'data_.installer.company_address':
                    formData.get('company_address'),
                'data_.installer.company_phone': formData.get('company_phone'),
                'data_.installer.company_email': formData.get('company_email'),
                'data_.project_address.street_address':
                    formData.get('street_address'),
                'data_.project_address.city': formData.get('city'),
                'data_.project_address.state': formData.get('state'),
                'data_.project_address.zip_code': formData.get('zip_code'),
            }
            await updateFieldInDocument(docId, updates)
            navigate('/', { replace: true })
        } else {
            alert('Please fix form errors before submitting.')
        }
    }

    const handleDocNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocName(e.target.value)
        validateDocName(e.target.value)
    }

    // Handle selection change
    const handleSelect = (docName: string | null) => {
        if (docName) {
            const selected = projectDocs.find(
                project => project.metadata_.doc_name === docName,
            )
            if (selected) {
                setSelectedProject(selected)
            }
        }
    }

    const validateDocName = (name: string) => {
        const regex = /^[a-zA-Z0-9]+(?:[ -][a-zA-Z0-9]+)*$/
        if (!regex.test(name) || name.length > 64) {
            setDocNameError(
                `Project name must be no more than 64 characters consisting of letters, numbers, 
                dashes, and single spaces. Single spaces can only appear between other characters.`,
            )
            return false
        }
        const isDuplicate = projectDocs.some(
            doc => doc.metadata_.doc_name === name,
        )
        if (isDuplicate) {
            setDocNameError(
                'Project name already exists. Please choose a different name.',
            )
            return false
        }
        setDocNameError('')
        return true
    }

    const updateFieldInDocument = async (
        docId: string | null,
        updates: Record<string, any>,
    ) => {
        try {
            // Fetch the document
            const doc = await db.get(docId)
            // Destructure the metadata to update the last_modified_at field
            const { metadata_ } = doc
            const updatedMetadata = {
                ...metadata_,
                doc_name: updates['metadata_.doc_name'],
                last_modified_at: new Date().toISOString(),
                status: 'created',
            }
            // Create an updated data_ object with the new installer and project info
            const updatedData = {
                ...doc.data_,
                installer: {
                    ...doc.data_.installer,
                    company_name: updates['data_.installer.company_name'],
                    email: updates['data_.installer.company_email'],
                    technician_name: updates['data_.installer.technician_name'],
                    company_address: updates['data_.installer.company_address'],
                    company_phone: updates['data_.installer.company_phone'],
                },
                project_address: {
                    ...doc.data_.project_address,
                    street_address:
                        updates['data_.project_address.street_address'],
                    city: updates['data_.project_address.city'],
                    state: updates['data_.project_address.state'],
                    zip_code: updates['data_.project_address.zip_code'],
                },
            }
            // Construct the updated document
            const updatedDoc = {
                ...doc,
                data_: updatedData,
                metadata_: updatedMetadata,
                _rev: doc._rev, // retain the current revision
            }
            // Save the updated document
            const response = await db.put(updatedDoc)
            console.log('Document updated successfully', response)
        } catch (error) {
            console.error('Error updating document:', error)
        }
    }

    return (
        <Form onSubmit={handleSubmitForm}>
            {selectedProject && (
                <DropdownButton
                    id="project-selector"
                    title={
                        selectedProject?.metadata_?.doc_name ||
                        'Select a Project'
                    }
                    onSelect={handleSelect}
                >
                    {projectDocs.map(project => (
                        <Dropdown.Item
                            key={project._id}
                            eventKey={project.metadata_.doc_name}
                        >
                            {project.metadata_.doc_name}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            )}
            <h4>New Project Information</h4>
            <FloatingLabel controlId="doc_name" label="Project Name">
                <Form.Control
                    type="text"
                    name="doc_name"
                    value={docName}
                    onChange={handleDocNameChange}
                    isInvalid={!!docNameError}
                />
                <Form.Control.Feedback type="invalid">
                    {docNameError}
                </Form.Control.Feedback>
            </FloatingLabel>
            <h5>Installer Information</h5>
            <p>
                <em>
                    The Installer information is optional, but we recommend
                    filling in at least one field for reference in the final
                    report.
                </em>
            </p>
            <FloatingLabel controlId="technician_name" label="Technician Name">
                <Form.Control
                    type="text"
                    name="technician_name"
                    defaultValue={formData.installer?.technician_name || ''}
                />
            </FloatingLabel>
            <FloatingLabel
                controlId="installation_company"
                label="Installation Company"
            >
                <Form.Control
                    type="text"
                    name="installation_company"
                    defaultValue={formData.installer?.company_name || ''}
                />
            </FloatingLabel>
            <FloatingLabel controlId="company_address" label="Company Address">
                <Form.Control
                    type="text"
                    name="company_address"
                    defaultValue={formData.installer?.company_address || ''}
                />
            </FloatingLabel>
            <FloatingLabel controlId="company_phone" label="Company Phone">
                <Form.Control
                    type="text"
                    name="company_phone"
                    defaultValue={formData.installer?.company_phone || ''}
                />
            </FloatingLabel>
            <FloatingLabel controlId="company_email" label="Company Email">
                <Form.Control
                    type="text"
                    name="company_email"
                    defaultValue={formData.installer?.company_email || ''}
                />
            </FloatingLabel>
            <h5>Project Address</h5>
            <FloatingLabel controlId="street_address" label="Street Address">
                <Form.Control
                    type="text"
                    name="street_address"
                    defaultValue={
                        formData.project_address?.street_address || ''
                    }
                />
            </FloatingLabel>
            <FloatingLabel controlId="city" label="City">
                <Form.Control
                    type="text"
                    name="city"
                    defaultValue={formData.project_address?.city || ''}
                />
            </FloatingLabel>
            <FloatingLabel className="mb-3" controlId="state" label="State">
                <Form.Select
                    name="state"
                    defaultValue={formData.project_address?.state || ''}
                >
                    <option key="" value="" />
                    {US_STATES.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="zip_code" label="Zip Code">
                <Form.Control
                    type="text"
                    name="zip_code"
                    defaultValue={formData.project_address?.zip_code || ''}
                />
            </FloatingLabel>
            {/* Photo Upload Wrapper */}
            <PhotoInputWrapper
                id="project_photos"
                label="Upload Project Photos"
                uploadable
            >
                <em>Please upload photos related to your project.</em>
            </PhotoInputWrapper>
            <Button
                onClick={handleCancelButtonClick}
                variant="secondary"
                type="button"
            >
                Cancel
            </Button>
            <Button type="submit">Save</Button>
        </Form>
    )
}

const WrappedNewProjectForm = () => {
    const location = useLocation()
    const extractIdFromURL = (url: string) => {
        const parts = url.split('/app/')
        return parts.length > 1 ? parts[1] : null
    }
    const docId = extractIdFromURL(location.pathname)
    if (!docId) return <div>Error: Cannot find document ID in the URL.</div>
    return (
        <StoreProvider
            dbName="quality-install-tool"
            docId={docId}
            workflowName={''}
            docName={''}
            type={'project'}
        >
            <NewProjectForm />
        </StoreProvider>
    )
}

export default WrappedNewProjectForm
