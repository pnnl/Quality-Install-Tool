import React, { useState, useEffect, useContext } from 'react'
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

interface Installer {
    technician_name: string
    name: string
    mailing_address: string
    phone: string
    email: string
}

interface Location {
    street_address: string
    city: string
    state: string
    zip_code: string
}

interface Project {
    type: string
    data_: {
        installer: Installer
        location?: Location
    }
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

const NewProjectForm: React.FC = () => {
    const navigate = useNavigate()
    const { docId } = useContext(StoreContext)
    const [projectDocs, setProjectDocs] = useState<Project[]>([])
    const [initialDocName, setInitialDocName] = useState<string>('')
    const [docNameInputError, setDocNameInputError] = useState<string>('')
    const [installationCompanyInputError, setInstallationCompanyInputError] =
        useState<string>('')
    const [formData, setFormData] = useState<
        Partial<Project['data_'] & { metadata_: { doc_name: string } }>
    >({})
    const [docStatus, setDocStatus] = useState<string>('')
    const [selectedInstallerName, setSelectedInstallerName] = useState<
        string | null
    >(null)
    const [uniqueInstallers, setUniqueInstallers] = useState<Project[] | null>(
        null,
    )
    const db = useDB()

    //Set up the form on first render
    useEffect(() => {
        setUpForm()
    }, [db])

    const setUpForm = async (): Promise<void> => {
        try {
            const allProjectDocs = await retrieveProjectDocs(db)
            setProjectDocs(allProjectDocs)

            const currentDoc = allProjectDocs.find(
                (project: Project) => project._id === docId,
            )
            if (currentDoc) {
                const currentDocStatus = currentDoc.metadata_.status
                setDocStatus(currentDocStatus)

                if (currentDocStatus === 'new') {
                    if (allProjectDocs.length > 1) {
                        const lastProject =
                            findLastModifiedProject(allProjectDocs)
                        setFormData({
                            installer: {
                                technician_name:
                                    lastProject?.data_.installer
                                        .technician_name || '',
                                name: lastProject?.data_.installer.name || '',
                                mailing_address:
                                    lastProject?.data_.installer
                                        .mailing_address || '',
                                phone: lastProject?.data_.installer.phone || '',
                                email: lastProject?.data_.installer.email || '',
                            },
                        })
                    }
                } else {
                    setFormData({
                        installer: {
                            technician_name:
                                currentDoc.data_.installer.technician_name ||
                                '',
                            name: currentDoc.data_.installer.name || '',
                            mailing_address:
                                currentDoc.data_.installer.mailing_address ||
                                '',
                            phone: currentDoc.data_.installer.phone || '',
                            email: currentDoc.data_.installer.email || '',
                        },
                        location: {
                            street_address:
                                currentDoc.data_.location?.street_address || '',
                            city: currentDoc.data_.location?.city || '',
                            state: currentDoc.data_.location?.state || '',
                            zip_code: currentDoc.data_.location?.zip_code || '',
                        },
                        metadata_: {
                            doc_name: currentDoc.metadata_.doc_name || '',
                        },
                    })
                    setInitialDocName(currentDoc.metadata_.doc_name)
                }
            }
        } catch (error) {
            console.error('Error retrieving project docs:', error)
        }
    }

    const getInstallerEntries = (entries: Project[]): Project[] => {
        const installerMap = new Map<string, Project>()

        entries.forEach(entry => {
            if (
                entry.metadata_ &&
                entry.metadata_.status !== 'new' &&
                entry.metadata_.last_modified_at
            ) {
                if (entry.data_ && entry.data_.installer) {
                    const installer = entry.data_.installer
                    const name = installer.name
                    const lastModifiedAt = new Date(
                        entry.metadata_.last_modified_at,
                    )

                    if (
                        !installerMap.has(name) ||
                        lastModifiedAt >
                            new Date(
                                installerMap.get(
                                    name,
                                )!.metadata_.last_modified_at,
                            )
                    ) {
                        installerMap.set(name, entry)
                    }
                }
            }
        })

        return Array.from(installerMap.values())
    }

    const findLastModifiedProject = (projectDocs: Project[]): Project => {
        const filteredProjects = projectDocs.filter(
            project => project.metadata_.status !== 'new',
        )
        return filteredProjects.reduce((latest, project) => {
            const latestDate = new Date(latest.metadata_.last_modified_at)
            const currentDate = new Date(project.metadata_.last_modified_at)
            return currentDate > latestDate ? project : latest
        })
    }

    //Cancel Button Functions:
    const handleCancelButtonClick = async () => {
        if (docStatus === 'created') {
            navigate('/', { replace: true })
            return
        }
        deleteEmptyProject()
    }

    const deleteEmptyProject = async () => {
        try {
            if (docStatus === 'new') {
                const projectDoc = await db.get(docId)
                if (projectDoc) {
                    await db.remove(projectDoc)
                }
            }
        } catch (error) {
            console.error('Error in discarding the empty project:', error)
        } finally {
            navigate('/', { replace: true })
        }
    }

    //Submit form Functions:
    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() //Prevent refresh of page
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const docNameValid = validateDocName(formData.get('doc_name'))
        const installationCompanyValid = validateInstallationCompany(
            formData.get('installation_company'),
        )

        if (docNameValid && installationCompanyValid) {
            const updates = {
                'metadata_.doc_name': formData.get('doc_name'),
                'data_.installer.technician_name':
                    formData.get('technician_name'),
                'data_.installer.name': formData.get('installation_company'),
                'data_.installer.mailing_address':
                    formData.get('mailing_address'),
                'data_.installer.phone': formData.get('phone'),
                'data_.installer.email': formData.get('company_email'),
                'data_.location.street_address': formData.get('street_address'),
                'data_.location.city': formData.get('city'),
                'data_.location.state': formData.get('state'),
                'data_.location.zip_code': formData.get('zip_code'),
            }
            await updateFieldsInDocument(docId, updates)
            navigate('/', { replace: true })
        } else {
            alert('Please fix form errors before submitting.')
        }
    }

    const updateFieldsInDocument = async (
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
                    name: updates['data_.installer.name'],
                    email: updates['data_.installer.email'],
                    technician_name: updates['data_.installer.technician_name'],
                    mailing_address: updates['data_.installer.mailing_address'],
                    phone: updates['data_.installer.phone'],
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
            await db.put(updatedDoc)
        } catch (error) {
            console.error('Error updating document:', error)
        }
    }

    const validateDocName = (name: FormDataEntryValue | null): boolean => {
        const regex = /^[a-zA-Z0-9]+(?:[ -][a-zA-Z0-9]+)*$/
        if (typeof name !== 'string') {
            setDocNameInputError('Doc name must be a string.')
            return false
        }
        if (!regex.test(name) || name.length > 64) {
            setDocNameInputError(
                `Project name must be no more than 64 characters consisting of letters, 
        numbers, dashes, and single spaces. Single spaces can only appear 
        between other characters.`,
            )
            return false
        }
        const isDuplicate = projectDocs.some(
            doc =>
                doc.metadata_.doc_name !== initialDocName &&
                doc.metadata_.doc_name === name,
        )
        if (isDuplicate) {
            setDocNameInputError(
                'Project name already exists. Please choose a different name.',
            )
            return false
        }
        setDocNameInputError('')
        return true
    }

    const validateInstallationCompany = (
        entry: FormDataEntryValue | null,
    ): boolean => {
        if (typeof entry !== 'string') {
            setInstallationCompanyInputError(
                'Installation Company must be a string.',
            )
            return false
        }

        if (!entry) {
            setInstallationCompanyInputError('Please fill out this field.')
            return false
        }

        setInstallationCompanyInputError('')
        return true
    }

    return (
        <Form
            onSubmit={handleSubmitForm}
            className="new-project-form container"
        >
            <h4>New Project Information</h4>
            <FloatingLabel controlId="doc_name" label="Project Name*">
                <Form.Control
                    type="text"
                    name="doc_name"
                    value={formData.metadata_?.doc_name || ''}
                    isInvalid={!!docNameInputError}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            metadata_: {
                                doc_name: e.target.value,
                            },
                        })
                    }
                />
                <Form.Control.Feedback type="invalid">
                    {docNameInputError}
                </Form.Control.Feedback>
            </FloatingLabel>
            <h5>Installer Information</h5>
            <p>
                <em>
                    Apart from the Installation Company Name, the installer
                    information is optional, but we recommend filling in at
                    least one more field for reference in the final report.
                </em>
            </p>
            <FloatingLabel
                controlId="installation_company"
                label="Installation Company*"
            >
                <Form.Control
                    type="text"
                    name="installation_company"
                    value={formData.installer?.name || ''}
                    isInvalid={!!installationCompanyInputError}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            installer: {
                                ...formData.installer!,
                                name: e.target.value,
                            },
                        })
                    }
                />
                <Form.Control.Feedback type="invalid">
                    {installationCompanyInputError}
                </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="technician_name" label="Technician Name">
                <Form.Control
                    type="text"
                    name="technician_name"
                    value={formData.installer?.technician_name || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            installer: {
                                ...formData.installer!,
                                technician_name: e.target.value,
                            },
                        })
                    }
                />
            </FloatingLabel>
            <FloatingLabel controlId="mailing_address" label="Company Address">
                <Form.Control
                    type="text"
                    name="mailing_address"
                    value={formData.installer?.mailing_address || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            installer: {
                                ...formData.installer!,
                                mailing_address: e.target.value,
                            },
                        })
                    }
                />
            </FloatingLabel>
            <FloatingLabel controlId="phone" label="Company Phone">
                <Form.Control
                    type="text"
                    name="phone"
                    value={formData.installer?.phone || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            installer: {
                                ...formData.installer!,
                                phone: e.target.value,
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
                                ...formData.installer!,
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
                                ...formData.location!,
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
                        setFormData(prevData => ({
                            ...prevData,
                            location: {
                                ...prevData.location!,
                                city: e.target.value,
                            },
                        }))
                    }
                />
            </FloatingLabel>
            <FloatingLabel className="mb-3" controlId="state" label="State">
                <Form.Select
                    name="state"
                    value={formData.location?.state || ''}
                    onChange={e =>
                        setFormData(prevData => ({
                            ...prevData,
                            location: {
                                ...prevData.location!,
                                state: e.target.value,
                            },
                        }))
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
                        setFormData(prevData => ({
                            ...prevData,
                            location: {
                                ...prevData.location!,
                                zip_code: e.target.value,
                            },
                        }))
                    }
                />
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
