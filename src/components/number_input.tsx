import React, { useCallback, useId, useMemo } from 'react'
import { FloatingLabel, Form, InputGroup } from 'react-bootstrap'

import { type Validator, validate } from '../utilities/validation_utils'

interface NumberInputProps {
    label: React.ReactNode
    prefix: React.ReactNode
    suffix: React.ReactNode
    value: string
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
    min,
    max,
    step,
    hint,
    onChange,
}) => {
    const id = useId()

    const valueValidators = useMemo<Validator<number>[]>(() => {
        return [
            input => {
                if (min && input < min) {
                    return `Input must be at least ${min}.`
                } else {
                    return undefined
                }
            },
            input => {
                if (max && input > max) {
                    return `Input must be at most ${max}.`
                } else {
                    return undefined
                }
            },
            input => {
                if (step && input % step !== 0) {
                    return `Input must be a multiple of ${step}.`
                } else {
                    return undefined
                }
            },
        ]
    }, [min, max, step])

    const errorMessages = useMemo<string[]>(() => {
        if (value) {
            if (typeof value === 'string' && value.trim().length === 0) {
                return []
            } else {
                const valueNumber = parseFloat(value)

                if (isNaN(valueNumber)) {
                    return ['Input must be a number.']
                } else {
                    return validate(valueNumber, valueValidators)
                }
            }
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

    const floatingLabel = (
        <FloatingLabel controlId={id} label={label}>
            <Form.Control
                onChange={handleChange}
                type="number"
                min={min}
                max={max}
                step={step}
                value={value ?? ''}
                isInvalid={errorMessages.length > 0}
            />
        </FloatingLabel>
    )

    return (
        <div className="mb-3">
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
