import { FC, useEffect, useState } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'

interface TextInputProps {
    id: string
    label: string
    updateValue: (inputValue: string) => void
    value: string
    min: number
    max: number
    regexp: RegExp
}

/**
 * A component for inputing multiline text
 *
 * @param id The id for the underlying html input
 * @param label The component label
 * @param updateValue A function called whenever the user changes the
 * input value. The function has the new input value as the sole arguement.
 * @param value The input value
 * @param min The minimum allowed number of characters for the input field.
 * @param max The maximum allowed number of characters for the input field.
 * @param regexp The regular expression pattern to validate the input string.
 */
const TextInput: FC<TextInputProps> = ({
    id,
    label,
    updateValue,
    value,
    min,
    max,
    regexp,
}) => {
    const [floatingLabelClasses, setFloatingLabelClasses] =
        useState<any>('mb-3')

    const [textAreaFocused, setTextAreaFocused] = useState<boolean>(false)

    const [error, setError] = useState<string>('')

    const handleChange = (inputValue: string) => {
        if (typeof inputValue !== 'string') {
            setError('Input must be a string')
        } else if (inputValue.length < min) {
            setError('Input must be at least ' + min + ' characters long')
        } else if (inputValue.length > max) {
            setError('Input must be at most ' + max + ' characters long')
        } else if (!regexp.test(inputValue)) {
            setError('Input must match' + regexp)
        } else {
            setError('')
            updateValue(inputValue)
        }
    }

    useEffect(() => {
        let floatingLabelClasses = 'mb-3'
        if (value || textAreaFocused) {
            floatingLabelClasses += ' label-hidden'
        }

        if (textAreaFocused) {
            floatingLabelClasses += ' text-area-expanded'
        }

        setFloatingLabelClasses(floatingLabelClasses)
    }, [value, textAreaFocused])

    return (
        <>
            <FloatingLabel className={floatingLabelClasses} label={label}>
                <Form.Control
                    as="textarea"
                    onChange={event => handleChange(event.target.value)}
                    placeholder="A placeholder"
                    value={value || ''}
                    isInvalid={Boolean(error)}
                    onFocus={() => setTextAreaFocused(true)}
                    onBlur={() => setTextAreaFocused(false)}
                />
                {error && (
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                )}
            </FloatingLabel>
        </>
    )
}

export default TextInput
