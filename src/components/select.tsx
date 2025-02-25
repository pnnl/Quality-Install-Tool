import React, { useCallback, useId } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

interface SelectProps {
    label: React.ReactNode
    options: string[] | [string, string][]
    onChange: (value: string) => Promise<void>
    value: string
}

const Select: React.FC<SelectProps> = ({ label, options, onChange, value }) => {
    const id = useId()

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
        </FloatingLabel>
    )
}

export default Select
