import React, { useId } from 'react'
import { FloatingLabel, Form, InputGroup } from 'react-bootstrap'

import { useDebouncedField } from '../hooks/useDebouncedField'

interface NumberInputProps {
    label: React.ReactNode
    prefix: React.ReactNode
    suffix: React.ReactNode
    value: string
    errorMessages: Array<string>
    min?: number
    max?: number
    step?: number
    hint: React.ReactNode
    onChange: (value: string) => Promise<void>
}

const NumberInput: React.FC<NumberInputProps> = ({
    label,
    prefix = '',
    suffix = '',
    value,
    errorMessages,
    min,
    max,
    step,
    hint,
    onChange,
}) => {
    const id = useId()

    const { localValue, handleChange, flush } = useDebouncedField(
        value,
        onChange,
    )

    const floatingLabel = (
        <FloatingLabel controlId={id} label={label}>
            <Form.Control
                onChange={handleChange}
                onBlur={flush}
                type="number"
                min={min}
                max={max}
                step={step}
                value={localValue}
                isInvalid={errorMessages.length > 0}
            />
        </FloatingLabel>
    )

    return (
        <div>
            {prefix || suffix ? (
                <InputGroup>
                    {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
                    {floatingLabel}
                    {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
                </InputGroup>
            ) : (
                floatingLabel
            )}
            {hint && <Form.Text>{hint}</Form.Text>}
            {errorMessages.length > 0 && (
                <Form.Control.Feedback type="invalid">
                    {errorMessages.join(' ')}
                </Form.Control.Feedback>
            )}
        </div>
    )
}

export default NumberInput
