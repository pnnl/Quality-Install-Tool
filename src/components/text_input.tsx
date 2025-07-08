import React, { useCallback, useId, useMemo, useState } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

interface TextInputProps {
    label: string
    onChange: (value: string) => Promise<void>
    value: string
    errorMessages: Array<string>
    placeholder?: string
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    onChange,
    value,
    errorMessages,
    placeholder,
}) => {
    const id = useId()

    const [isFocused, setIsFocused] = useState<boolean>(false)

    const floatingLabelClassName = useMemo<string>(() => {
        const classNames = []

        if (isFocused || value) {
            classNames.push('text-area-expanded')
        }

        if (value) {
            classNames.push('label-hidden')
        }

        return classNames.join(' ')
    }, [isFocused, value])

    const handleChange = useCallback(
        async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            await onChange(event.target.value)
        },
        [onChange],
    )

    return (
        <FloatingLabel
            controlId={id}
            className={floatingLabelClassName}
            label={label}
        >
            <Form.Control
                as="textarea"
                onChange={handleChange}
                placeholder={placeholder}
                value={value}
                isInvalid={errorMessages.length > 0}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {errorMessages.length > 0 && (
                <Form.Control.Feedback type="invalid">
                    {errorMessages.join(' ')}
                </Form.Control.Feedback>
            )}
        </FloatingLabel>
    )
}

export default TextInput
