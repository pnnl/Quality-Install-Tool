import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

interface DateInputProps {
    label: React.ReactNode
    value: string
    onChange: (value: string) => Promise<void>
}

// Debounce delay (ms) before triggering the DB write.
// Prevents PouchDB 409 conflicts from rapid input changes.
const DEBOUNCE_MS = 300

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => {
    const id = useId()

    // Local state keeps the UI responsive
    const [localValue, setLocalValue] = useState(value)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Ref avoids stale closure: always calls the latest onChange
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    // Sync local state from parent (e.g. when doc updates from DB)
    useEffect(() => {
        setLocalValue(value)
    }, [value])

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value
            // Update UI immediately
            setLocalValue(newValue)

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

    // Clean up pending timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    return (
        <FloatingLabel controlId={id} label={label}>
            <Form.Control
                type="date"
                value={localValue}
                onChange={handleChange}
            />
        </FloatingLabel>
    )
}

export default DateInput
