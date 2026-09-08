import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { FloatingLabel, Form, InputGroup } from 'react-bootstrap'

// Debounce delay (ms) before triggering the DB write.
// Prevents PouchDB 409 conflicts from rapid keystrokes.
const DEBOUNCE_MS = 300

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
            // Flush any pending debounced write immediately on blur.
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
            void onChangeRef.current(event.target.value)
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
                onFocus={handleFocus}
                onBlur={handleBlur}
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
