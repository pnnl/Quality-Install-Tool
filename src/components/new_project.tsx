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
    const [initialDocName, setInitialDocName] = useState('') // This is for editing an existing project, to keep track of the name it started with
    const [docNameInputError, setDocNameInputError] = useState('')
    const [formData, setFormData] = useState<any>({})
    const [docStatus, setDocStatus] = useState<string>('') // new, created etc
    const [selectedProject, setSelectedProject] = useState<Project | null>(null) // To keep track of the project that the user chooses to prepopulate the installer fields
    const [selectedInstaller, setSelectedInstaller] = useState<Project | null>(
        null,
    )
    const [uniqueInstallers, setUniqueInstallers] = useState<any[] | null>(null)
    const db = useDB()

    //Set up the form:
    useEffect(() => {
        setUpForm()
    }, [db])

    const setUpForm = async (): Promise<void> => {
        try {
            const allProjectDocs = await retrieveProjectDocs(db)
            //ProjectDocs set in state to validate project name edits
            //and create a list of installer information selection options to pre-populate form

            setProjectDocs(allProjectDocs)
            console.log('All projects', allProjectDocs)
            const currentDoc = allProjectDocs.filter(
                (project: Project) => project._id === docId,
            )[0]
            const currentDocStatus = currentDoc.metadata_.status
            setDocStatus(currentDocStatus)

            if (currentDocStatus === 'new') {
                if (allProjectDocs.length > 1) {
                    const lastProject = findLastModifiedProject(allProjectDocs)
                    //get unique installer information from projects to populate Installer Info dropdown
                    setUniqueInstallers(getInstallerEntries(allProjectDocs))
                    //set the selectedInstaller information to last used installer info

                    setSelectedInstaller(lastProject.data_.name)
                    setFormData({
                        installer: {
                            technician_name:
                                lastProject?.data_.installer?.technician_name ||
                                '',
                            name: lastProject?.data_.installer?.name || '',
                            mailing_address:
                                lastProject?.data_.installer?.mailing_address ||
                                '',
                            phone: lastProject?.data_.installer?.phone || '',
                            email: lastProject?.data_.installer?.email || '',
                        },
                    })
                }
            } else {
                //In the case that the user is editing an existing project...
                //Populate the entire form with that project's data
                setFormData({
                    installer: {
                        technician_name:
                            currentDoc?.data_.installer?.technician_name || '',
                        name: currentDoc?.data_.installer?.name || '',
                        mailing_address:
                            currentDoc?.data_.installer?.mailing_address || '',
                        phone: currentDoc?.data_.installer?.phone || '',
                        email: currentDoc?.data_.installer?.email || '',
                    },
                    location: {
                        street_address:
                            currentDoc?.data_.location?.street_address || '',
                        city: currentDoc?.data_.location?.city || '',
                        state: currentDoc?.data_.location?.state || '',
                        zip_code: currentDoc?.data_.location?.zip_code || '',
                    },
                    metadata_: {
                        doc_name: currentDoc?.metadata_?.doc_name || '',
                    },
                })
                //set initialDocName to exisiting docName so we can allow it through validation
                setInitialDocName(currentDoc?.metadata_?.doc_name)
            }
        } catch (error) {
            console.error('Error retrieving project docs:', error)
        }
    }

    function getInstallerEntries(data: any) {
        // Create a map to store the latest entry for each installer
        const installerMap = new Map()

        data.forEach((entry: any) => {
            const installer = entry.data_.installer
            const metadata = entry.metadata_

            if (installer && metadata) {
                const name = installer.name
                const lastModifiedAt = new Date(metadata.last_modified_at)

                if (
                    !installerMap.has(name) ||
                    lastModifiedAt >
                        new Date(installerMap.get(name).lastModifiedAt)
                ) {
                    installerMap.set(name, {
                        installer: {
                            technician_name: installer.technician_name,
                            name: installer.name,
                            mailing_address: installer.mailing_address,
                            phone: installer.phone,
                            email: installer.email,
                        },
                        lastModifiedAt: metadata.last_modified_at,
                    })
                }
            }
        })

        // Return array of latest installer entries
        return Array.from(installerMap.values()).map(entry => entry.installer)
    }

    const findLastModifiedProject = (projectDocs: Project[]) => {
        const filteredProjects = projectDocs.filter(
            project => project.metadata_.status !== 'new',
        )
        return filteredProjects.reduce((latest, project) => {
            const latestDate = new Date(latest.metadata_.last_modified_at)
            const currentDate = new Date(project.metadata_.last_modified_at)
            return currentDate > latestDate ? project : latest
        })
    }

    //Installer information selection function:
    const handleSelectExistingInstallerInfo = (
        selectedInstaller: string | null,
    ) => {
        // if (selectedInstaller === 'CLEAR_FORM') {
        //     setFormData((prevData: any) => ({
        //         ...prevData,
        //         installer: {
        //             // Only reset installer information
        //             technician_name: '',
        //             name: '',
        //             mailing_address: '',
        //             phone: '',
        //             email: '',
        //         },
        //     }))
        //     setSelectedInstaller(null)
        // } else if (selectedInstaller) {
        //     const selected = uniqueInstallers.find(
        //         array => array.slice(0, 3).join(', ') === selectedInstaller,
        //     )
        //     if (selected) {
        //         setSelectedInstaller(selected)
        //         setFormData({
        //             installer: {
        //                 technician_name: selected[0],
        //                 name: selected[1],
        //                 phone: selected[2],
        //                 email: selected[3],
        //                 mailing_address: selected[4],
        //             },
        //         })
        //     } else {
        //         console.log('Error in the installer selector.')
        //     }
        // } else {
        //     console.log('Error in the installer selector.')
        // }
    }

    //Cancel button functions:
    const handleCancelButtonClick = async (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        if (docStatus === 'created') {
            navigate('/', { replace: true })
            return
        }
        deleteEmptyProject()
    }

    const deleteEmptyProject = async () => {
        try {
            if (docStatus === 'new') {
                const projectDoc: any = await db.get(docId)
                if (projectDoc) {
                    db.remove(projectDoc)
                }
            }
        } catch (error) {
            console.error('Error in discarding the empty project:', error)
        } finally {
            navigate('/', { replace: true })
        }
    }

    // Save form functions:
    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        if (validateDocName(formData.get('doc_name'))) {
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
            const response = await db.put(updatedDoc)
            console.log('Document updated successfully', response)
        } catch (error) {
            console.error('Error updating document:', error)
        }
    }

    const validateDocName = (name: FormDataEntryValue | null) => {
        const regex = /^[a-zA-Z0-9]+(?:[ -][a-zA-Z0-9]+)*$/
        if (typeof name !== 'string') {
            return false
        }
        if (!regex.test(name) || name.length > 64) {
            ///make this logic better
            setDocNameInputError(
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
            setDocNameInputError(
                'Project name already exists. Please choose a different name.',
            )
            return false
        }
        setDocNameInputError('')
        return true
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
                    value={formData?.metadata_?.doc_name || ''}
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
                    The Installer information is optional, but we recommend
                    filling in at least one field for reference in the final
                    report.
                </em>
            </p>
            {projectDocs.length > 1 &&
                docStatus === 'new' &&
                uniqueInstallers &&
                uniqueInstallers.length > 0 && (
                    <>
                        <p>
                            New projects are pre-populated with installer
                            information from your most recent project. You can
                            clear these fields or choose a different one from
                            the drop down menu:
                        </p>
                        <DropdownButton
                            id="project-selector"
                            title={
                                selectedInstaller
                                    ? selectedInstaller.data_.name
                                    : 'Select Installer Information'
                            }
                            onSelect={handleSelectExistingInstallerInfo}
                        >
                            {uniqueInstallers.map(obj => {
                                return (
                                    <Dropdown.Item
                                        key={obj.name}
                                        eventKey={obj.name}
                                    >
                                        {obj.name}
                                    </Dropdown.Item>
                                )
                            })}
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="CLEAR_FORM">
                                Clear Installer Information
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
                    required
                    value={formData.installer?.name || ''}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            installer: {
                                ...formData.installer,
                                name: e.target.value,
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
                                ...formData.installer,
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
                                ...formData.installer,
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
