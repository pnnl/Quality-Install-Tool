import { get } from 'lodash'
import React, { useMemo } from 'react'

import StringInput from './string_input'
import { StoreContext } from '../providers/store_provider'
import { type Validator, validate } from '../utilities/validation_utils'

interface StringInputWrapperProps {
    label: string
    path: string
    min: number
    max: number
    regexp: RegExp
    hint: string
}

const StringInputWrapper: React.FC<StringInputWrapperProps> = ({
    label,
    path,
    min = 0,
    max = 1024,
    regexp = /.*/,
    hint,
}) => {
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

    return (
        <StoreContext.Consumer>
            {({ doc, upsertData }) => {
                return (
                    <StringInput
                        label={label}
                        value={(doc && get(doc.data_, path)) ?? ''}
                        errorMessages={
                            (doc &&
                                (get(
                                    doc.metadata_.errors?.data_ ?? {},
                                    path,
                                ) as string[])) ??
                            []
                        }
                        hint={hint}
                        onChange={async value =>
                            await upsertData(
                                path,
                                value,
                                validate(value, valueValidators),
                            )
                        }
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default StringInputWrapper
