import React, { useState, useEffect } from 'react'
import { useDB } from '../utilities/database_utils'
import PhotoInputWrapper from './photo_input_wrapper'
import { Form, Button, FloatingLabel } from 'react-bootstrap'
import { US_STATES } from './us_state_select_wrapper'

export default function NewProject() {
    const [projectDocs, setProjectDocs] = useState<any[]>([])
    const [docName, setDocName] = useState('')
    const [docNameError, setDocNameError] = useState('')
    const db = useDB()

    const project_info = async (): Promise<void> => {
        const { retrieveProjectDocs } = await import(
            '../utilities/database_utils'
        )
        retrieveProjectDocs(db).then((res: any) => {
            setProjectDocs(res)
        })
    }

    useEffect(() => {
        project_info()
    }, [])

    const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // stops the page refresh
        if (validateDocName(docName)) {
            const form = e.target as HTMLFormElement
            const formData = new FormData(form)
            const formValues = Object.fromEntries(formData.entries())
            console.log(formValues)
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

            <PhotoInputWrapper
                id="building_number_photo"
                label="Building Number – Photo"
                children="Provide a photo of the building that shows the building number."
            />

            <Button variant="secondary" type="button">
                Cancel
            </Button>
            <Button type="submit">Save</Button>
        </Form>
    )
}
