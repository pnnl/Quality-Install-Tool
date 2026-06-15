import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

interface StringInputProps {
    label: string
    value: string
    errorMessages: Array<string>
    hint: string
    onChange: (value: string) => Promise<void>
}

// Debounce delay (ms) before triggering the DB write.
// Prevents PouchDB 409 conflicts from rapid keystrokes.
const DEBOUNCE_MS = 300

const StringInput: React.FC<StringInputProps> = ({
    label,
    value,
    errorMessages,
    hint,
    onChange,
}) => {
    const id = useId()

    // Local state keeps the UI responsive on every keystroke
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
            // Update UI immediately — no data loss
            setLocalValue(newValue)

            // Reset the debounce timer on each keystroke so only the
            // final value after the user pauses is written to PouchDB
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            timerRef.current = setTimeout(() => {
                void onChangeRef.current(newValue)
            }, DEBOUNCE_MS)
        },
        [],
    )

    // Clean up pending timer on unmount to avoid memory leaks
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
                onChange={handleChange}
                type="text"
                value={localValue}
                isInvalid={errorMessages.length > 0}
            />
            {hint && <Form.Text>{hint}</Form.Text>}
            {errorMessages.length > 0 && (
                <Form.Control.Feedback type="invalid">
                    {errorMessages.join(' ')}
                </Form.Control.Feedback>
            )}
        </FloatingLabel>
    )
}

export default StringInput
