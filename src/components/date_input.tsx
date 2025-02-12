import React, { useId } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

interface DateInputProps {
    label: React.ReactNode
    value: string
    onChange: (value: string) => Promise<void>
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => {
    const id = useId()

    return (
        <FloatingLabel className="mb-3" controlId={id} label={label}>
            <Form.Control
                type="date"
                value={value ?? ''}
                onChange={async event => onChange(event.target.value)}
            />
        </FloatingLabel>
    )
}

export default DateInput
