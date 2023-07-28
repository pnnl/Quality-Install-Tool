import type { FC } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'

interface DateInputProps {
    id: string
    label: string
    handleValueChange: (value: string) => void
    value: string
}

/**
 * A component for inputing a date
 *
 * @param id The id for the underlying html input
 * @param label The component label
 * @param handleValueChange A function called whenever the user changes the
 * input value. The function has the new input value as the sole arguement.
 */
const DateInput: FC<DateInputProps> = ({
    id,
    label,
    handleValueChange,
    value,
}) => {
    return (
        <>
            <FloatingLabel className="mb-3" controlId={id} label={label}>
                <Form.Control
                    onChange={event => {
                        handleValueChange(event.target.value)
                    }}
                    type="date"
                    value={value}
                />
            </FloatingLabel>
        </>
    )
}

export default DateInput
