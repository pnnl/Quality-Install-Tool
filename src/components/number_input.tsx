import type { FC } from 'react'
import React from 'react'
import { useState, useRef, useEffect } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

interface NumberInputProps {
    id: string
    label: string
    prefix: string
    suffix: string
    updateValue: (inputValue: string) => void
    value: number
    min: number
    max: number
    hint: string
}

/**
 * A component for inputing a number
 *
 * @param id The id for the underlying html input
 * @param label The component label
 * @param prefix Text to appear as a prefix to the NumberInput (e.g. '$' if the input
 * represents a number of dollars)
 * @param suffix Text to appear as a suffix to the NumberInput (e.g. 'SqFt')
 * @param updateValue A function called whenever the user changes the
 * input value. The function has the new input value as the sole arguement.
 * @param value The input value
 * @param min The minimum allowed value for the input field.
 * @param max The maximum allowed value for the input field.
 * @param hint Displays hint text for the component.
 */
const NumberInput: FC<NumberInputProps> = ({
    id,
    label,
    prefix = '',
    suffix = '',
    updateValue,
    value,
    min,
    max,
    hint,
}): any => {
    const validateInput = (inputValue: number): string => {
        if (inputValue < min) {
            return 'Input must be at least ' + String(min)
        } else if (inputValue > max) {
            return 'Input must be at most ' + String(max)
        } else {
            return ''
        }
    }

    const [error, setError] = useState<string>(validateInput(value))
    const [localValue, setLocalValue] = useState<string>(
        value as unknown as string,
    )

    const handleChange = (inputValue: string): any => {
        const inputValueNum: number = parseFloat(inputValue)
        if (isNaN(inputValueNum)) {
            setError('Input must be a number')
        } else {
            updateValue(inputValue)
            setError(validateInput(inputValueNum))
        }
    }

    return (
        <InputGroup className="mb-3">
            {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
            <FloatingLabel controlId={id} label={label}>
                <Form.Control
                    onChange={event => {
                        setLocalValue(event.target.value)
                        handleChange(event.target.value)
                    }}
                    type="number"
                    value={localValue}
                    isInvalid={Boolean(error)}
                />
                {hint && <Form.Text>{hint}</Form.Text>}
                {error && (
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                )}
            </FloatingLabel>
            {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
        </InputGroup>
    )
}

export default NumberInput
