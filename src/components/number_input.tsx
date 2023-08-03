import type { FC } from 'react'
import { useState, useRef, useEffect } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

interface NumberInputProps {
    id: string
    label: string
    prefix: string
    suffix: string
    updateValue: (inputValue: string) => void
    value: number
    min: number
    max: number
}

/**
 * A component for inputing a number
 *
 * @param id The id for the underlying html input
 * @param label The component label
 * @param prefix Text to appear as a prefix to the NumberInput (e.g. '$' if the input
 * represents a number of dollars)
 * @param suffix Text to appear as a suffix to the NumberInput (e.g. 'SqFt')
 * @param updateValue A function called whenever the user changes the
 * input value. The function has the new input value as the sole arguement.
 * @param value The input value
 * @param min The minimum allowed value for the input field.
 * @param max The maximum allowed value for the input field.
 */
const NumberInput: FC<NumberInputProps> = ({
    id,
    label,
    prefix = '',
    suffix = '',
    updateValue,
    value,
    min,
    max,
}): any => {
    const [error, setError] = useState<string>('')

<<<<<<< HEAD
    // use the cursor postion when user edits the data in the component
    const [cursor, setCursor] = useState<number | null>(null)
=======
    const [cursor, setCursor] = useState(null)
>>>>>>> 5f64963 (Set the type in useRef)
    const ref = useRef<HTMLInputElement>(null)

    // Refresh after the first render and every time the component updates
    useEffect(() => {
        const input = ref.current
        if (!!input) input.setSelectionRange(cursor, cursor)
    }, [ref, cursor, value])

    const handleChange = (inputValue: string): any => {
        const inputValueNum: number = parseInt(inputValue)
        if (isNaN(inputValueNum)) {
            setError('Input must be a number')
        } else if (inputValueNum < min) {
            setError('Input must be at least ' + String(min))
        } else if (inputValueNum > max) {
            setError('Input must be at most ' + String(max))
        } else {
            setError('')
        }
        updateValue(inputValue)
    }

    return (
        <InputGroup>
            {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
            <FloatingLabel className="mb-3" controlId={id} label={label}>
                <Form.Control
                    ref={ref}
                    onChange={event => {
                        setCursor(event.target.selectionStart) // Set the cursor position as the selectionStart
                        handleChange(event.target.value)
                    }}
                    type="text"
                    inputMode="numeric"
                    value={value != null ? value : ''}
                    isInvalid={Boolean(error)}
                />
                {error && (
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                )}
            </FloatingLabel>
            {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
        </InputGroup>
    )
}

export default NumberInput



