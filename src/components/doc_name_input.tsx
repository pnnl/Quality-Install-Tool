import React, { FC, useState, useEffect } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import { retrieveProjectDocs } from '../utilities/database_utils'
import PouchDB from 'pouchdb'
import dbName from './db_details'

interface DocNameInputProps {
    id: string
    label: string
    updateValue: (inputValue: string) => void
    value: string
    regexp: RegExp
    hint: string
}

const DocNameInput: FC<DocNameInputProps> = ({
    id,
    label,
    updateValue,
    value,
    regexp,
    hint,
}) => {
    const [inputValue, setInputValue] = useState(value)
    const [initialValue] = useState(value)
    const [errorMessage, setErrorMessage] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [projectList, setProjectList] = useState<any[]>([])

    const db = new PouchDB(dbName)

    const retrieveProjectInfo = async (): Promise<void> => {
        try {
            const res = await retrieveProjectDocs(db)
            setProjectList(res)
        } catch (error) {
            console.error('Error retrieving project docs:', error)
        }
    }

    useEffect(() => {
        retrieveProjectInfo()
    }, [])

    useEffect(() => {
        const projectNames = projectList.map(doc => doc.metadata_.doc_name)
        console.log(initialValue, inputValue)
        if (
            (value === undefined && projectNames.length === 0) ||
            initialValue === inputValue
        )
            setIsValid(true)
        else
            setIsValid(
                validateInput.every(validator =>
                    validator.validator(inputValue, projectNames),
                ),
            )
    }, [inputValue, projectList])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value
        setInputValue(input)
        isValid ? updateValue(input) : null
    }

    const evalErrorMessage = () => {
        setErrorMessage('')
        if (!isValid) {
            const errorValidator = validateInput.find(
                validator =>
                    !validator.validator(
                        inputValue,
                        projectList.map(doc => doc.metadata_.doc_name),
                    ),
            )
            const errorMessage = errorValidator?.errorMsg || ''
            setErrorMessage(errorMessage)
        }
    }

    const validateInput = [
        {
            validator: (input: string, projectNames: string[]) => {
                return regexp.test(input) && input
            },
            errorMsg:
                'The project name must be no more than 64 characters consisting of letters, numbers, dashes, and single spaces. Single spaces can only appear between other characters.',
        },
        {
            validator: (input: string, projectNames: string[]) =>
                !projectNames.includes(input),
            errorMsg:
                'Project name already exists. Please choose a different name.',
        },
    ]

    return (
        <FloatingLabel className="mb-3" controlId={id} label={label}>
            <Form.Control
                onChange={handleInputChange}
                type="text"
                value={inputValue}
                onBlur={evalErrorMessage}
                onClick={evalErrorMessage}
                isInvalid={!isValid}
            />
            {hint && <Form.Text>{hint}</Form.Text>}
            {errorMessage && (
                <Form.Control.Feedback type="invalid">
                    {errorMessage}
                </Form.Control.Feedback>
            )}
        </FloatingLabel>
    )
}

export default DocNameInput
