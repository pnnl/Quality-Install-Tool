import React, { useCallback, useId, useRef } from 'react'
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

// Debounce delay (ms) before triggering the DB write.
// Prevents PouchDB 409 conflicts from rapid input changes.
const DEBOUNCE_MS = 300

const Radio: React.FC<RadioProps> = ({ label, onChange, options, value }) => {
    const id = useId()
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Ref avoids stale closure: always calls the latest onChange
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    const handleChange = useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            const newValue = event.currentTarget.value

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
