import React, { FC, useState, useEffect } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import { getProjects, useDB } from '../utilities/database_utils'

/**
 * Props interface for the DocNameInput component.
 *
 * @property id - Unique identifier for the input element.
 * @property label - Label text to be displayed for the input field.
 * @property updateValue - Callback function to update the doc in DB with the new input value.
 * @property value - Initial value of the input field.
 * @property regexp - Regular expression to validate the input value.
 * @property hint - Optional hint text to be displayed below the input field.
 */
interface DocNameInputProps {
    id: string
    label: string
    updateValue: (inputValue: string) => void
    value: string
    regexp: RegExp
    hint: string
}

/**
 * A component that renders an input field with validation for project names.
 *
 * This component uses a regular expression to validate the input and checks for
 * duplicates among existing project names. It displays appropriate error messages
 * if the input is invalid.
 *
 * @param props - The properties of the component.
 * @returns The rendered component.
 */
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
    const [projectNames, setProjectNames] = useState<any[]>([])

    const db = useDB()

    /*
     * Retrieves project information from the database and updates the component state.
     */
    const retrieveProjectInfo = async (): Promise<void> => {
        try {
            const res = await getProjects(db)
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
        setProjectNames(projectNames)
    }, [inputValue, projectList])

    // Validates the input value and updates the component state accordingly.
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value
        setInputValue(input)
        const isValid_result = validateInput.every(validator =>
            validator.validator(input, projectNames),
        )
        setIsValid(isValid_result)
        if (isValid_result) {
            updateValue(input)
        }
    }

    // Evaluates and sets the error message based on the validation result.
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

    // Validation rules for the input field
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
                !projectNames.includes(input.trim()),
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
                onKeyUp={evalErrorMessage}
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
