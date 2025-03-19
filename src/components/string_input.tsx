import React, { useCallback, useId } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

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

    const handleChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            await onChange(event.target.value)
        },
        [onChange],
    )

    return (
        <FloatingLabel className="mb-3" controlId={id} label={label}>
            <Form.Control
                onChange={handleChange}
                type="text"
                value={value}
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
