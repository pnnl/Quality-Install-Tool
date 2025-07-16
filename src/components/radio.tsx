import React, { useCallback, useId } from 'react'
import { Card, Form } from 'react-bootstrap'

interface RadioProps {
    label: React.ReactNode
    options: string[]
    value: string
    onChange: (value: string) => Promise<void>
}

const Radio: React.FC<RadioProps> = ({ label, options, value, onChange }) => {
    const id = useId()

    const handleChange = useCallback(
        async (event: React.FormEvent<HTMLInputElement>) => {
            await onChange(event.currentTarget.value)
        },
        [onChange],
    )

    return (
        <Card className="input-card">
            <Card.Body>
                <p className="mb-3 custom-label">{label}</p>
                <Form.Group className="radio-group">
                    {options.map((option, index) => (
                        <Form.Check
                            key={index}
                            id={`${id}_${index}`}
                            type="radio"
                            label={option}
                            value={option}
                            checked={option === value}
                            onChange={handleChange}
                        />
                    ))}
                </Form.Group>
            </Card.Body>
        </Card>
    )
}

export default Radio
