import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { FloatingLabel, Form, InputGroup } from 'react-bootstrap'

interface NumberInputProps {
    label: React.ReactNode
    prefix: React.ReactNode
    suffix: React.ReactNode
    value: string
    errorMessages: Array<string>
    min?: number
    max?: number
    step?: number
    hint: React.ReactNode
    onChange: (value: string) => Promise<void>
}

// Debounce delay (ms) before triggering the DB write.
// Prevents PouchDB 409 conflicts from rapid input changes.
const DEBOUNCE_MS = 300

const NumberInput: React.FC<NumberInputProps> = ({
    label,
    prefix = '',
    suffix = '',
    value,
    errorMessages,
    min,
    max,
    step,
    hint,
    onChange,
}) => {
    const id = useId()

    // Local state keeps the UI responsive on every change
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

            // Reset the debounce timer on each change so only the
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

    const floatingLabel = (
        <FloatingLabel controlId={id} label={label}>
            <Form.Control
                onChange={handleChange}
                type="number"
                min={min}
                max={max}
                step={step}
                value={localValue}
                isInvalid={errorMessages.length > 0}
            />
        </FloatingLabel>
    )

    return (
        <div>
            {prefix || suffix ? (
                <InputGroup>
                    {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
                    {floatingLabel}
                    {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
                </InputGroup>
            ) : (
                floatingLabel
            )}
            {hint && <Form.Text>{hint}</Form.Text>}
            {errorMessages.length > 0 && (
                <Form.Control.Feedback type="invalid">
                    {errorMessages.join(' ')}
                </Form.Control.Feedback>
            )}
        </div>
    )
}

export default NumberInput
