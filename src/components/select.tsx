import React, { useCallback, useId } from 'react'
import { Card, Form } from 'react-bootstrap'

interface SelectProps {
    label: React.ReactNode
    options: string[] | [string, string][]
    onChange: (value: string) => Promise<void>
    path: string
    value: string
}

const Select: React.FC<SelectProps> = ({
    label,
    options,
    onChange,
    path,
    value,
}) => {
    const id = useId()

    const handleChange = useCallback(
        async (event: React.ChangeEvent<HTMLSelectElement>) => {
            await onChange(event.target.value)
        },
        [onChange],
    )

    return (
        <Card>
            <Form.Group controlId={path} className="select-group">
                <label>{label}</label>
                <Form.Select
                    value={value || ''}
                    onChange={handleChange}
                    aria-label={`Select ${label}`}
                >
                    <option disabled value="">
                        Select...
                    </option>
                    {options.map(option => {
                        if (Array.isArray(option)) {
                            return (
                                <option key={option[1]} value={option[1]}>
                                    {option[0]}
                                </option>
                            )
                        } else {
                            return (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            )
                        }
                    })}
                </Form.Select>
            </Form.Group>
        </Card>
    )
}

export default Select
