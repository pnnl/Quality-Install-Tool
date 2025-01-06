import React, { useState, useEffect, useContext } from 'react'
import {
    Form,
    Button,
    FloatingLabel,
    Dropdown,
    DropdownButton,
} from 'react-bootstrap'
import { US_STATES } from './us_state_select_wrapper'
import { useDB, retrieveProjectDocs } from '../utilities/database_utils'
import { useNavigate } from 'react-router-dom'
import PhotoInputWrapper from './photo_input_wrapper'
import { StoreContext } from './store'
import type {
    Project,
    InstallerData,
    LocationData,
    FormData,
} from '../types/new_project.types'

const NewProjectForm: React.FC = () => {
    const navigate = useNavigate()
    const { docId } = useContext(StoreContext)
    const [projectDocs, setProjectDocs] = useState<Project[]>([])
    const [formData, setFormData] = useState<FormData>({})
    const [docName, setDocName] = useState('')
    const [initialDocName, setInitialDocName] = useState('')
    const [docNameError, setDocNameError] = useState('')
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [docStatus, setDocStatus] = useState<string>('')
    const db = useDB()

    useEffect(() => {
        const fetchProjectDocs = async () => {
            try {
                const res = await retrieveProjectDocs(db)
                setProjectDocs(res)
                setSelectedProject(lastModifiedProject(res))
            } catch (error) {
                console.error('Error retrieving project docs:', error)
            }
        }
        fetchProjectDocs()
    }, [db])

    useEffect(() => {
        const fetchProjectDoc = async () => {
            if (docId) {
                try {
                    const doc = await db.get(docId)
                    setFormData(doc.data_)
                    setDocName(doc.metadata_.doc_name)
                    setDocStatus(doc.metadata_.status)
                    if (doc.metadata_.status === 'created') {
                        setInitialDocName(doc.metadata_.doc_name)
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
            setFormData((prevData: FormData) => ({
                ...prevData,
                installer: {
                    ...selectedProject.data_.installer,
                },
            }))
        }
    }, [selectedProject])

    const lastModifiedProject = (projectDocs: Project[]): Project | null =>
        projectDocs
            .filter(project => project.metadata_.status !== 'new')
            .reduce(
                (latest, project) =>
                    new Date(project.metadata_.last_modified_at) >
                    new Date(latest.metadata_.last_modified_at)
                        ? project
                        : latest,
                projectDocs[0],
            ) || null

    const handleCancel = async () => {
        if (docStatus === 'created') {
            navigate('/', { replace: true })
        } else {
            await deleteEmptyProject()
            navigate('/', { replace: true })
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (validateDocName(docName)) {
            const formData = new FormData(e.currentTarget)
            const updates: Record<string, any> = {
                'metadata_.doc_name': formData.get('doc_name') as string,
            }
            ;[
                'technician_name',
                'company_name',
                'company_address',
                'company_phone',
                'email',
                'street_address',
                'city',
                'state',
                'zip_code',
            ].forEach(field => {
                const value = formData.get(field)
                if (value) {
                    const key = `data_.${field.replace(/_/g, '.')}`
                    updates[key] = value
                }
            })

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

    const deleteEmptyProject = async () => {
        try {
            if (docStatus === 'new') {
                const projectDoc = await db.get(docId)
                if (projectDoc) {
                    await db.remove(projectDoc)
                    setDocStatus('deleted')
                }
            }
        } catch (error) {
            console.error('Error in discarding the empty project:', error)
        }
    }

    const validateDocName = (name: string): boolean => {
        const regex = /^[a-zA-Z0-9]+(?:[ -][a-zA-Z0-9]+)*$/
        if (!regex.test(name) || name.length > 64) {
            setDocNameError(
                'Project name must be no more than 64 characters consisting of letters, numbers, dashes, and single spaces. Single spaces can only appear between other characters.',
            )
            return false
        }
        if (
            projectDocs.some(
                doc =>
                    doc.metadata_.doc_name === name &&
                    doc.metadata_.doc_name !== initialDocName,
            )
        ) {
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
            const updatedDoc = {
                ...doc,
                data_: {
                    ...doc.data_,
                    installer: updates,
                },
                metadata_: {
                    ...doc.metadata_,
                    doc_name: updates['metadata_.doc_name'],
                    last_modified_at: new Date().toISOString(),
                    status: 'created',
                },
            }
            await db.put(updatedDoc)
        } catch (error) {
            console.error('Error updating document:', error)
        }
    }

    const handleSelect = (docName: string | null) => {
        if (docName === 'CLEAR_FORM') {
            setFormData((prevData: FormData) => ({
                ...prevData,
                installer: {
                    technician_name: '',
                    company_name: '',
                    company_address: '',
                    company_phone: '',
                    email: '',
                },
            }))
        } else if (docName) {
            const selected = projectDocs.find(
                project => project.metadata_.doc_name === docName,
            )
            if (selected) {
                setSelectedProject(selected)
            }
        }
    }

    return (
        <Form onSubmit={handleSubmit} className="new-project-form container">
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
                            selectedProject?.metadata_.doc_name ||
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
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="CLEAR_FORM">
                            Clear Form
                        </Dropdown.Item>
                    </DropdownButton>
                </>
            )}
            {[
                'technician_name',
                'company_name',
                'company_address',
                'company_phone',
                'email',
            ].map(field => (
                <FloatingLabel
                    key={field}
                    controlId={field}
                    label={field
                        .replace(/_/g, ' ')
                        .replace(/^\w/, c => c.toUpperCase())}
                >
                    <Form.Control
                        type="text"
                        name={field}
                        value={
                            formData.installer?.[
                                field as keyof InstallerData
                            ] || ''
                        }
                        onChange={e =>
                            setFormData((prevData: FormData) => ({
                                ...prevData,
                                installer: {
                                    ...prevData.installer,
                                    [field as keyof InstallerData]:
                                        e.target.value,
                                },
                            }))
                        }
                    />
                </FloatingLabel>
            ))}
            <h5>Project Address</h5>
            {['street_address', 'city', 'zip_code'].map(field => (
                <FloatingLabel
                    key={field}
                    controlId={field}
                    label={field
                        .replace(/_/g, ' ')
                        .replace(/^\w/, c => c.toUpperCase())}
                >
                    <Form.Control
                        type="text"
                        name={field}
                        value={
                            formData.location?.[field as keyof LocationData] ||
                            ''
                        }
                        onChange={e =>
                            setFormData((prevData: FormData) => ({
                                ...prevData,
                                location: {
                                    ...prevData.location,
                                    [field as keyof LocationData]:
                                        e.target.value,
                                },
                            }))
                        }
                    />
                </FloatingLabel>
            ))}
            <FloatingLabel className="mb-3" controlId="state" label="State">
                <Form.Select
                    name="state"
                    value={formData.location?.state || ''}
                    onChange={e =>
                        setFormData((prevData: FormData) => ({
                            ...prevData,
                            location: {
                                ...prevData.location,
                                state: e.target.value,
                            },
                        }))
                    }
                >
                    <option value="" />
                    {US_STATES.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Form.Select>
            </FloatingLabel>
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
                    onClick={handleCancel}
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
