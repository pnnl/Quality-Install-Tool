import React, { useCallback, useId } from 'react'
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
const Checkbox: React.FC<CheckboxProps> = ({
    label,
    options,
    onChange,
    value: initialValue,
    hidden,
}) => {
    const id = useId()

    const handleChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value, checked } = event.target

            const selectedValues = checked
                ? [...initialValue, value]
                : initialValue.filter(item => item !== value)

            await onChange(selectedValues)
        },
        [initialValue, onChange],
    )

    return (
        <Card className="input-card" hidden={hidden}>
            <Card.Body>
                {label && <p className="mb-3 custom-label">{label}</p>}
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
