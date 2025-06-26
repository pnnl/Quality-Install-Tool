import React, { useMemo } from 'react'
import DateStr from './date_str'
import parseNumberOrNull from '../utilities/string_to_number_utils'

export interface LabelValueProps {
    label?: React.ReactNode
    value?: React.ReactNode
    required?: boolean
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    decimalPlaces?: number
    type?: 'string' | 'number' | 'date'
    dateOptions?: Intl.DateTimeFormatOptions
}

const LabelValue: React.FC<LabelValueProps> = ({
    label,
    value,
    required = false,
    prefix = '',
    suffix = '',
    decimalPlaces = 1,
    type = 'string',
    dateOptions,
}: LabelValueProps): JSX.Element | null => {
    //Numbers are being stored as strings right now in DB, so we can try to fix them
    const convertedValue = useMemo(() => {
        if (type === 'number' && typeof value === 'string') {
            return parseNumberOrNull(value)
        }
        return value
    }, [value, type])

    const formattedValue = useMemo(() => {
        let finalValue = convertedValue

        // If type is "number" and decimalPlaces, round the value
        if (type === 'number') {
            if (typeof finalValue === 'number' && !isNaN(finalValue)) {
                if (
                    typeof decimalPlaces === 'number' &&
                    !isNaN(decimalPlaces)
                ) {
                    finalValue = finalValue.toFixed(decimalPlaces)
                } else {
                    console.log(
                        'Make sure that your decimalPlaces param is actually a number.',
                    )
                }
            } else {
                console.log(
                    `You are trying to set the type of a non-number value to 'number'. Value is: ${finalValue} and typeof value is: ${typeof finalValue}`,
                )
            }
        }
        return finalValue
    }, [convertedValue, decimalPlaces, type])

    return required || formattedValue ? (
        label ? (
            <div className="top-bottom-padding">
                <span>
                    <strong>{label}: </strong>
                </span>
                {prefix}
                {type === 'date' && typeof formattedValue === 'string' ? (
                    <DateStr date={formattedValue} options={dateOptions} />
                ) : (
                    formattedValue
                )}
                {suffix}
            </div>
        ) : (
            <>
                {prefix}
                {type === 'date' && typeof formattedValue === 'string' ? (
                    <DateStr date={formattedValue} options={dateOptions} />
                ) : (
                    formattedValue
                )}
                {suffix}
            </>
        )
    ) : null
}

export default LabelValue
