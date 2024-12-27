import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, FloatingLabel } from 'react-bootstrap'
import { US_STATES } from './us_state_select_wrapper'
import { StoreProvider, StoreContext } from './store' // Import StoreProvider and StoreContext
import { useDB } from '../utilities/database_utils'
import DBName from '../utilities/db_details'
import { useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const NewProjectForm = () => {
    debugger
    const { upsertAttachment, upsertData, upsertMetadata } =
        useContext(StoreContext) // Use context
    const [projectDocs, setProjectDocs] = useState<any[]>([])
    const [docName, setDocName] = useState('')
    const [docNameError, setDocNameError] = useState('')
    const db = useDB() // Assuming useDB() provides the necessary db instance

    // useEffect(() => {
    //     const project_info = async (): Promise<void> => {
    //         const { retrieveProjectDocs } = await import(
    //             '../utilities/database_utils'
    //         )
    //         retrieveProjectDocs(db).then((res: any) => {
    //             setProjectDocs(res)
    //         })
    //     }

    //     project_info()
    // }, [db])

    const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // stops the page refresh
        if (validateDocName(docName)) {
            const form = e.target as HTMLFormElement
            const formData = new FormData(form)

            // Upsert metadata
            upsertMetadata('status', 'created')
            upsertMetadata('doc_name', docName)
            upsertMetadata('created_at', new Date().toISOString())
            upsertMetadata('last_modified_at', new Date().toISOString())

            // Upsert form data under appropriate fields
            upsertData(
                'installer.company_name',
                formData.get('installation_company') || '',
            )
            upsertData('installer.name', formData.get('technician_name') || '')
            upsertData(
                'installer.mailing_address',
                formData.get('company_address') || '',
            )
            upsertData('installer.phone', formData.get('company_phone') || '')
            upsertData('installer.email', formData.get('company_email') || '')
            upsertData(
                'location.street_address',
                formData.get('street_address') || '',
            )
            upsertData('location.city', formData.get('city') || '')
            upsertData('location.state', formData.get('state') || '')
            upsertData('location.zip_code', formData.get('zip_code') || '')

            alert('submitted')
        } else {
            alert('Please fix form errors before submitting.')
        }
    }

    const handleDocNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocName(e.target.value)
        validateDocName(e.target.value)
    }

    const validateDocName = (name: string) => {
        const regex = /^[a-zA-Z0-9]+(?:[ -][a-zA-Z0-9]+)*$/
        if (!regex.test(name) || name.length > 64) {
            setDocNameError(
                'Project name must be no more than 64 characters consisting of letters, numbers, dashes, and single spaces. Single spaces can only appear between other characters.',
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
    const location = useLocation()
    const url = location.pathname
    const extractIdFromURL = (url: string) => {
        // Assuming the URL is in the format .../app/{id}
        const parts = url.split('/app/')
        return parts.length > 1 ? parts[1] : null
    }
    const docId = extractIdFromURL(url)

    const updateFieldInDocument = async (docId: any, updates: any) => {
        // debugger
        try {
            // Fetch the document
            const doc = await db.get(docId)

            // Modify the fields
            const updatedDoc = {
                ...doc,
                ...updates,
                metadata_: {
                    ...doc.metadata_,
                    last_modified_at: new Date().toISOString(),
                },
            }

            // Save the updated document
            const response = await db.put(updatedDoc)
            console.log('Document updated successfully', response)
        } catch (error) {
            console.error('Error updating document:', error)
            return <div>ERROR</div>
        }
    }

    const updates = {
        'data_.installer.company_name': 'Updated Company Name',
        'data_.installer.email': 'updated_email@example.com',
    }

    updateFieldInDocument(docId, updates)

    return (
        <Form onSubmit={handleSubmitForm}>
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
                <Form.Control type="text" name="technician_name" />
            </FloatingLabel>

            <FloatingLabel
                controlId="installation_company"
                label="Installation Company"
            >
                <Form.Control type="text" name="installation_company" />
            </FloatingLabel>

            <FloatingLabel controlId="company_address" label="Company Address">
                <Form.Control type="text" name="company_address" />
            </FloatingLabel>

            <FloatingLabel controlId="company_phone" label="Company Phone">
                <Form.Control type="text" name="company_phone" />
            </FloatingLabel>

            <FloatingLabel controlId="company_email" label="Company Email">
                <Form.Control type="text" name="company_email" />
            </FloatingLabel>

            <h5>Project Address</h5>
            <FloatingLabel controlId="street_address" label="Street Address">
                <Form.Control type="text" name="street_address" />
            </FloatingLabel>

            <FloatingLabel controlId="city" label="City">
                <Form.Control type="text" name="city" />
            </FloatingLabel>

            <FloatingLabel className="mb-3" controlId="state" label="State">
                <Form.Select name="state">
                    <option key="" value="" />
                    {US_STATES.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Form.Select>
            </FloatingLabel>

            <FloatingLabel controlId="zip_code" label="Zip Code">
                <Form.Control type="text" name="zip_code" />
            </FloatingLabel>

            <Form.Group controlId="building_number_photo" className="mb-3">
                <Form.Label>Building Number – Photo</Form.Label>
                <Form.Control
                    type="file"
                    name="building_number_photo"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0]
                        if (file) {
                            upsertAttachment(file, 'building_number_photo')
                        }
                    }}
                />
                <Form.Text className="text-muted">
                    Provide a photo of the building that shows the building
                    number.
                </Form.Text>
            </Form.Group>

            <Button variant="secondary" type="button">
                Cancel
            </Button>
            <Button type="submit">Save</Button>
        </Form>
    )
}

export default NewProjectForm
