import React, { useState } from 'react'
import { Form, Button, FloatingLabel } from 'react-bootstrap'
import { US_STATES } from './us_state_select_wrapper'

import { useDB } from '../utilities/database_utils'

import { useLocation, useNavigate } from 'react-router-dom'

const NewProjectForm = () => {
    const navigate = useNavigate()
    const [projectDocs, setProjectDocs] = useState<any[]>([])
    const [docName, setDocName] = useState('')
    const [docNameError, setDocNameError] = useState('')
    const db = useDB() // Assuming useDB() provides the necessary db instance

    const location = useLocation()
    const url = location.pathname
    const extractIdFromURL = (url: string) => {
        const parts = url.split('/app/')
        return parts.length > 1 ? parts[1] : null
    }
    const docId = extractIdFromURL(url)

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
            <h1>PUT PHOTO UPLOAD HERE</h1>

            <Button variant="secondary" type="button">
                Cancel
            </Button>
            <Button type="submit">Save</Button>
        </Form>
    )
}

export default NewProjectForm
