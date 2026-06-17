import React, { useCallback, useRef } from 'react'
import { Card, Form } from 'react-bootstrap'

interface SelectProps {
    label: React.ReactNode
    onChange: (value: string) => Promise<void>
    options: string[] | [string, string][]
    path: string
    value: string
}

// Debounce delay (ms) before triggering the DB write.
// Prevents PouchDB 409 conflicts from rapid input changes.
const DEBOUNCE_MS = 300

const Select: React.FC<SelectProps> = ({
    label,
    onChange,
    options,
    path,
    value,
}) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Ref avoids stale closure: always calls the latest onChange
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const newValue = event.target.value

            // Reset the debounce timer on each change
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            timerRef.current = setTimeout(() => {
                void onChangeRef.current(newValue)
            }, DEBOUNCE_MS)
        },
        [],
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
