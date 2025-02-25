import React, { useCallback, useId, useMemo, useState } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

import { type Validator, validate } from '../utilities/validation_utils'

interface TextInputProps {
    label: string
    onChange: (value: string) => Promise<void>
    value: string
    min: number
    max: number
    regexp: RegExp
    placeholder?: string
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    onChange,
    value,
    min,
    max,
    regexp,
    placeholder,
}) => {
    const id = useId()

    const [isFocused, setIsFocused] = useState<boolean>(false)

    const floatingLabelClassName = useMemo<string>(() => {
        const classNames = ['mb-3']

        if (isFocused || value) {
            classNames.push('text-area-expanded')
        }

        if (value) {
            classNames.push('label-hidden')
        }

        return classNames.join(' ')
    }, [isFocused, value])

    const valueValidators = useMemo<Validator<string>[]>(() => {
        return [
            input => {
                if (input.length < min) {
                    return `Input must be at least ${min} character${min === 1 ? '' : 's'} long.`
                } else {
                    return undefined
                }
            },
            input => {
                if (input.length > max) {
                    return `Input must be at most ${max} character${max === 1 ? '' : 's'} long.`
                } else {
                    return undefined
                }
            },
            input => {
                if (regexp.test(input)) {
                    return undefined
                } else {
                    return 'Input must match the pattern.'
                }
            },
        ]
    }, [min, max, regexp])

    const errorMessages = useMemo<string[]>(() => {
        if (value) {
            return validate(value, valueValidators)
        } else {
            return []
        }
    }, [value, valueValidators])

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
                value={value || ''}
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
