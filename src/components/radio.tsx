import React, { useCallback, useId } from 'react'
import { Card, Form } from 'react-bootstrap'

export interface RadioOption {
    label: React.ReactNode
    value: string
}

interface RadioProps {
    label: React.ReactNode
    onChange: (value: string) => Promise<void>
    options: Array<string | RadioOption>
    value: string
}

const Radio: React.FC<RadioProps> = ({ label, onChange, options, value }) => {
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
                <div className="mb-3">{label}</div>
                <Form.Group className="radio-group">
                    {options.map((option, index) => (
                        <Form.Check
                            key={index}
                            id={`${id}_${index}`}
                            type="radio"
                            label={
                                typeof option === 'string'
                                    ? option
                                    : option.label
                            }
                            value={
                                typeof option === 'string'
                                    ? option
                                    : option.value
                            }
                            checked={
                                (typeof option === 'string'
                                    ? option
                                    : option.value) === value
                            }
                            onChange={handleChange}
                        />
                    ))}
                </Form.Group>
            </Card.Body>
        </Card>
    )
}

export default Radio
