import React from 'react'
import { FC, useState, useEffect, useRef } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'

interface StringInputProps {
    id: string
    label: string
    updateValue: (inputValue: string) => void
    value: string
    min: number
    max: number
    regexp: RegExp
    hint: string
}

/**
 * A component for inputing a string
 *
 * @param id The id for the underlying html input
 * @param label The component label
 * @param updateValue A function called whenever the user changes the
 * input value. The function has the new input value as the sole arguement.
 * @param value The input value
 * @param min The minimum allowed value for the input field.
 * @param max The maximum allowed value for the input field.
 * @param regexp The regular expression pattern to validate the input string.
 * @param hint Displays hint text for the StringInput component.
 */
const StringInput: FC<StringInputProps> = ({
    id,
    label,
    updateValue,
    value,
    min,
    max,
    regexp,
    hint,
}) => {
    const [error, setError] = useState<string>('')

    const handleChange = (inputValue: string) => {
        if (inputValue.length < min) {
            setError('Input must be at least ' + min + ' characters long')
        } else if (inputValue.length > max) {
            setError('Input must be at most ' + max + ' characters long')
        } else if (!regexp.test(inputValue)) {
            setError('Input must match the pattern')
        } else {
            setError('')
        }
        updateValue(inputValue)
    }
    return (
        <>
            <FloatingLabel className="mb-3" controlId={id} label={label}>
                <Form.Control
                    onChange={event => handleChange(event.target.value)}
                    type="text"
                    value={value || ''}
                    isInvalid={Boolean(error)}
                />
                {hint && <Form.Text>{hint}</Form.Text>}
                {error && (
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                )}
            </FloatingLabel>
        </>
    )
}

export default StringInput
