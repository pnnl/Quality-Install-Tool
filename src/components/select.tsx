import React, { useCallback } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

interface SelectProps {
    id: string
    label: React.ReactNode
    options: string[]
    onChange: (value: string) => Promise<void>
    value: string
}

const Select: React.FC<SelectProps> = ({
    id,
    label,
    options,
    onChange,
    value,
}) => {
    const handleChange = useCallback(
        async (event: React.ChangeEvent<HTMLSelectElement>) => {
            await onChange(event.target.value)
        },
        [onChange],
    )

    return (
        <FloatingLabel className="mb-3" controlId={id} label={label}>
            <Form.Select value={value || ''} onChange={handleChange}>
                <option key="" value="" />
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </Form.Select>
        </FloatingLabel>
    )
}

export default Select
