import { get } from 'lodash'
import React, { useMemo } from 'react'

import NumberInput from './number_input'
import { StoreContext } from '../providers/store_provider'
import { type Validator, validate } from '../utilities/validation_utils'

function _validate(
    value: number | string,
    valueValidators: Array<Validator<number>>,
): string[] {
    switch (typeof value) {
        case 'string':
            if (value.trim().length === 0) {
                return []
            } else {
                return _validate(parseFloat(value), valueValidators)
            }
        case 'number':
            if (isNaN(value)) {
                return ['Input must be a number.']
            } else {
                return validate(value, valueValidators)
            }
    }
}

interface NumberInputWrapperProps {
    label: React.ReactNode
    path: string
    prefix: React.ReactNode
    suffix: React.ReactNode
    min?: number
    max?: number
    step?: number
    hint: React.ReactNode
}

const NumberInputWrapper: React.FC<NumberInputWrapperProps> = ({
    label,
    path,
    prefix,
    suffix,
    min,
    max,
    step,
    hint,
}) => {
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

    return (
        <StoreContext.Consumer>
            {({ doc, upsertData }) => {
                return (
                    <NumberInput
                        label={label}
                        prefix={prefix}
                        suffix={suffix}
                        value={(doc && get(doc.data_, path)) ?? ''}
                        errorMessages={
                            (doc &&
                                (get(
                                    doc.metadata_.errors?.data_ ?? {},
                                    path,
                                ) as string[])) ??
                            []
                        }
                        min={min}
                        max={max}
                        step={step}
                        hint={hint}
                        onChange={async value =>
                            await upsertData(
                                path,
                                value,
                                _validate(value, valueValidators),
                            )
                        }
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default NumberInputWrapper
