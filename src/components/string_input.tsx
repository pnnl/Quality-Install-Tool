import React, { useCallback, useId, useMemo } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

import { type Validator, validate } from '../utilities/validation_utils'

interface StringInputProps {
    label: string
    value: string
    min: number
    max: number
    regexp: RegExp
    hint: string
    onChange: (value: string) => Promise<void>
}

const StringInput: React.FC<StringInputProps> = ({
    label,
    value,
    min,
    max,
    regexp,
    hint,
    onChange,
}) => {
    const id = useId()

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
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            await onChange(event.target.value)
        },
        [onChange],
    )

    return (
        <FloatingLabel className="mb-3" controlId={id} label={label}>
            <Form.Control
                onChange={handleChange}
                type="text"
                value={value || ''}
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
