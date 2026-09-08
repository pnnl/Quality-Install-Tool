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

    // While the field is focused we never overwrite localValue from the
    // incoming prop. The prop is the round-trip echo of our own debounced
    // write (delayed by the async PouchDB write queue + live changes feed),
    // and adopting it mid-typing clobbers characters the user just entered.
    const isFocusedRef = useRef(false)

    // Ref avoids stale closure: always calls the latest onChange
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    // Sync local state from parent (e.g. when doc updates from DB), but not
    // while the user is actively editing — see isFocusedRef above.
    useEffect(() => {
        if (isFocusedRef.current) return
        setLocalValue(value)
    }, [value])

    const flush = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }, [])

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

    const handleFocus = useCallback(() => {
        isFocusedRef.current = true
    }, [])

    const handleBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            isFocusedRef.current = false
            // Flush any pending debounced write immediately on blur so the
            // value is persisted without waiting out the debounce window.
            flush()
            void onChangeRef.current(event.target.value)
        },
        [flush],
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
                onFocus={handleFocus}
                onBlur={handleBlur}
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
