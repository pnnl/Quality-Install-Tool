import React from 'react'
import { FC, useEffect, useState } from 'react'
import { FloatingLabel } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

interface CheckboxProps {
    id: string
    label: string
    options: string[]
    updateValue: (values: string[]) => void
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
const Checkbox: FC<CheckboxProps> = ({
    id,
    label,
    options,
    updateValue,
    value: initialValue,
    hidden,
}) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(
        initialValue || [],
    )

    useEffect(() => {
        // Sync internal state with the default value prop
        setSelectedValues(initialValue)
        // update the default checked options in DB
        updateValue(initialValue)
    }, [initialValue])

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target
        if (checked) {
            setSelectedValues(prevValues => {
                const newValues =
                    prevValues == undefined ? [value] : [...prevValues, value]
                updateValue(newValues)
                return newValues
            })
        } else {
            setSelectedValues(prevValues => {
                const newValues = prevValues.filter(item => item !== value)
                updateValue(newValues)
                return newValues
            })
        }
    }
    return (
        <Card className="input-card" hidden={hidden}>
            <Card.Body>
                <label className="mb-3 custom-label">{label}</label>
                <Form.Group className="mb-3" controlId={id}>
                    {options.map(option => (
                        <Form.Check
                            type="checkbox"
                            label={option}
                            name={label}
                            value={option}
                            checked={
                                selectedValues &&
                                selectedValues.includes(option)
                            }
                            onChange={handleOptionChange}
                            key={option}
                        />
                    ))}
                </Form.Group>
            </Card.Body>
        </Card>
    )
}

export default Checkbox
