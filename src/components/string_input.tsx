import React, { useId } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

import { useDebouncedField } from '../hooks/useDebouncedField'

interface StringInputProps {
    label: string
    value: string
    errorMessages: Array<string>
    hint: string
    onChange: (value: string) => Promise<void>
}

const StringInput: React.FC<StringInputProps> = ({
    label,
    value,
    errorMessages,
    hint,
    onChange,
}) => {
    const id = useId()

    const { localValue, handleChange, flush } = useDebouncedField(
        value,
        onChange,
    )

    return (
        <FloatingLabel controlId={id} label={label}>
            <Form.Control
                onChange={handleChange}
                onBlur={flush}
                type="text"
                value={localValue}
                isInvalid={errorMessages.length > 0}
            />
            {hint && <Form.Text>{hint}</Form.Text>}
            {errorMessages.length > 0 && (
                <Form.Control.Feedback type="invalid">
                    {errorMessages.join(' ')}
                </Form.Control.Feedback>
            )}
        </FloatingLabel>
    )
}

export default StringInput
