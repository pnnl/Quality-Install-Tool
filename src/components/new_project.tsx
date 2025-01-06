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
import { useNavigate } from 'react-router-dom'
import PhotoInputWrapper from './photo_input_wrapper'
import { StoreContext } from './store'
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
    const { docId } = React.useContext(StoreContext)
    const [projectDocs, setProjectDocs] = useState<Project[]>([])
    const [docName, setDocName] = useState('')
    const [initialDocName, setInitialDocName] = useState('') // State to keep track of initial document name
    const [docNameError, setDocNameError] = useState('')
    const [formData, setFormData] = useState<any>({})
    const [docStatus, setDocStatus] = useState<string>('')
    const [selectedProject, setSelectedProject] = useState<any>()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const db = useDB()

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
        const filteredProjects = projectDocs.filter(
            project => project.metadata_.status !== 'new',
        )
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
                    if (doc.metadata_.status === 'created') {
                        setInitialDocName(doc.metadata_.doc_name) // Set the initial document name if status is created
                    }
                } catch (error) {
                    console.error('Error fetching document:', error)
                }
            }
        }
        fetchProjectDoc()
    }, [docId, db])

    useEffect(() => {
        if (selectedProject) {
            setFormData((prevData: any) => ({
                ...prevData,
                installer: {
                    technician_name:
                        selectedProject.data_.installer?.technician_name || '',
                    company_name:
                        selectedProject.data_.installer?.company_name || '',
                    company_address:
                        selectedProject.data_.installer?.company_address || '',
                    company_phone:
                        selectedProject.data_.installer?.company_phone || '',
                    email: selectedProject.data_.installer?.email || '',
                },
            }))
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
        e.preventDefault()
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
                'data_.installer.email': formData.get('company_email'),
                'data_.location.street_address': formData.get('street_address'),
                'data_.location.city': formData.get('city'),
                'data_.location.state': formData.get('state'),
                'data_.location.zip_code': formData.get('zip_code'),
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

    const handleSelect = (docName: string | null) => {
        if (docName === 'CLEAR_FORM') {
            setFormData((prevData: any) => ({
                ...prevData,
                installer: {
                    // Only reset installer information
                    technician_name: '',
                    company_name: '',
                    company_address: '',
                    company_phone: '',
                    email: '',
                },
            }))
            setDropdownOpen(true)
        } else if (docName) {
            const selected = projectDocs.find(
                project => project.metadata_.doc_name === docName,
            )
            if (selected) {
                setSelectedProject(selected)
            }
            setDropdownOpen(false)
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
            doc =>
                doc.metadata_.doc_name !== initialDocName &&
                doc.metadata_.doc_name === name, // Allow initial document name
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
            const doc = await db.get(docId)
            const { metadata_ } = doc
            const updatedMetadata = {
                ...metadata_,
                doc_name: updates['metadata_.doc_name'],
                last_modified_at: new Date().toISOString(),
                status: 'created',
            }
            const updatedData = {
                ...doc.data_,
                installer: {
                    ...doc.data_.installer,
                    company_name: updates['data_.installer.company_name'],
                    email: updates['data_.installer.email'],
                    technician_name: updates['data_.installer.technician_name'],
                    company_address: updates['data_.installer.company_address'],
                    company_phone: updates['data_.installer.company_phone'],
                },
                location: {
                    ...doc.data_.location,
                    street_address: updates['data_.location.street_address'],
                    city: updates['data_.location.city'],
                    state: updates['data_.location.state'],
                    zip_code: updates['data_.location.zip_code'],
                },
            }
            const updatedDoc = {
                ...doc,
                data_: updatedData,
                metadata_: updatedMetadata,
                _rev: doc._rev,
            }
            const response = await db.put(updatedDoc)
            console.log('Document updated successfully', response)
        } catch (error) {
            console.error('Error updating document:', error)
        }
    }

    return (
        <Form
            onSubmit={handleSubmitForm}
            className="new-project-form container"
        >
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
            {projectDocs.length > 1 && (
                <>
                    <p>
                        The installer information has been pre-populated with
                        information from your last project. You can clear these
                        fields or fill them from another project in the dropdown
                        menu:
                    </p>
                    <DropdownButton
                        id="project-selector"
                        title={
                            selectedProject?.metadata_?.doc_name ||
                            'Select a Project'
                        }
                        onSelect={handleSelect}
                        onToggle={() => setDropdownOpen(prev => !prev)}
                    >
                        {projectDocs.map(project => (
                            <Dropdown.Item
                                key={project._id}
                                eventKey={project.metadata_.doc_name}
                            >
                                {project.metadata_.doc_name}
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="CLEAR_FORM">
                            Clear Form
                        </Dropdown.Item>
                    </DropdownButton>
                </>
            )}

            <FloatingLabel controlId="technician_name" label="Technician Name">
                <Form.Control
                    type="text"
                    name="technician_name"
                    value={formData.installer?.technician_name || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            installer: {
                                ...formData.installer,
                                technician_name: e.target.value,
                            },
                        })
                    }
                />
            </FloatingLabel>
            <FloatingLabel
                controlId="installation_company"
                label="Installation Company"
            >
                <Form.Control
                    type="text"
                    name="installation_company"
                    value={formData.installer?.company_name || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            installer: {
                                ...formData.installer,
                                company_name: e.target.value,
                            },
                        })
                    }
                />
            </FloatingLabel>
            <FloatingLabel controlId="company_address" label="Company Address">
                <Form.Control
                    type="text"
                    name="company_address"
                    value={formData.installer?.company_address || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            installer: {
                                ...formData.installer,
                                company_address: e.target.value,
                            },
                        })
                    }
                />
            </FloatingLabel>
            <FloatingLabel controlId="company_phone" label="Company Phone">
                <Form.Control
                    type="text"
                    name="company_phone"
                    value={formData.installer?.company_phone || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            installer: {
                                ...formData.installer,
                                company_phone: e.target.value,
                            },
                        })
                    }
                />
            </FloatingLabel>
            <FloatingLabel controlId="company_email" label="Company Email">
                <Form.Control
                    type="text"
                    name="company_email"
                    value={formData.installer?.email || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            installer: {
                                ...formData.installer,
                                email: e.target.value,
                            },
                        })
                    }
                />
            </FloatingLabel>
            <h5>Project Address</h5>
            <FloatingLabel controlId="street_address" label="Street Address">
                <Form.Control
                    type="text"
                    name="street_address"
                    value={formData.location?.street_address || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            location: {
                                ...formData.location,
                                street_address: e.target.value,
                            },
                        })
                    }
                />
            </FloatingLabel>
            <FloatingLabel controlId="city" label="City">
                <Form.Control
                    type="text"
                    name="city"
                    value={formData.location?.city || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            location: {
                                ...formData.location,
                                city: e.target.value,
                            },
                        })
                    }
                />
            </FloatingLabel>
            <FloatingLabel className="mb-3" controlId="state" label="State">
                <Form.Select
                    name="state"
                    value={formData.location?.state || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            location: {
                                ...formData.location,
                                state: e.target.value,
                            },
                        })
                    }
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
                    value={formData.location?.zip_code || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            location: {
                                ...formData.location,
                                zip_code: e.target.value,
                            },
                        })
                    }
                />
            </FloatingLabel>
            {/* Photo Upload Wrapper */}
            <PhotoInputWrapper
                id="project_photos"
                label="Building Number - Photo"
                uploadable
            >
                <em>
                    Provide a photo of the building that shows the building
                    number.
                </em>
            </PhotoInputWrapper>
            <div className="buttons-div">
                <Button
                    onClick={handleCancelButtonClick}
                    variant="secondary"
                    type="button"
                >
                    Cancel
                </Button>
                <Button type="submit">Save Project</Button>
            </div>
        </Form>
    )
}

export default NewProjectForm
