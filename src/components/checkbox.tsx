import React, { useCallback, useId, useRef } from 'react'
import { Card, Form } from 'react-bootstrap'

interface CheckboxProps {
    label: string
    options: string[]
    onChange: (values: string[]) => Promise<void>
    value: string[]
    hidden?: boolean
}

/**
 * Component for a checkbox input
 *
 * @param id The id for the underlying html input
 * @param label The component label
 * @param options An array of strings representing the options for the underlying checkbox input
 * @param updateValue A function called whenever the user changes the
 * input value. The function has the new input value as the sole argument.
 * @param value The current value of the input
 */

// Debounce delay (ms) before triggering the DB write.
// Prevents PouchDB 409 conflicts from rapid input changes.
const DEBOUNCE_MS = 300

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    options,
    onChange,
    value: initialValue,
    hidden,
}) => {
    const id = useId()
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Ref avoids stale closure: always calls the latest onChange
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value, checked } = event.target

            const selectedValues = checked
                ? [...initialValue, value]
                : initialValue.filter(item => item !== value)

            // Reset the debounce timer on each change
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            timerRef.current = setTimeout(() => {
                void onChangeRef.current(selectedValues)
            }, DEBOUNCE_MS)
        },
        [initialValue],
    )

    return (
        <Card className="input-card" hidden={hidden}>
            <Card.Body>
                {label && <div className="mb-3 custom-label">{label}</div>}
                <Form.Group>
                    {options.map((option, index) => (
                        <Form.Check
                            key={index}
                            id={`${id}_${index}`}
                            type="checkbox"
                            label={option}
                            value={option}
                            checked={initialValue.includes(option)}
                            onChange={handleChange}
                        />
                    ))}
                </Form.Group>
            </Card.Body>
        </Card>
    )
}

export default Checkbox
