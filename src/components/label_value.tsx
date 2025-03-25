import React from 'react'
import DateStr from './date_str'

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
    function convertStringToNumber(input: string): number | null {
        const parsedNumber = Number(input)
        return isNaN(parsedNumber) ? null : parsedNumber
    }

    //Numbers are being stored as strings right now in DB, so we can try to fix them
    if (type === 'number' && typeof value === 'string') {
        const convertedValue = convertStringToNumber(value)
        if (convertedValue !== null) {
            value = convertedValue
        }
    }

    // If type is "number" and decimalPlaces, round the value
    if (type === 'number') {
        if (typeof value === 'number' && !isNaN(value)) {
            if (typeof decimalPlaces === 'number' && !isNaN(decimalPlaces)) {
                value = value.toFixed(decimalPlaces)
            } else {
                console.log(
                    'Make sure that your decimalPlaces param is actually a number.',
                )
            }
        } else {
            console.log(
                `You are trying to set the type of a non-number value to 'number'. Value is: ${value} and typeof value is: ${typeof value}`,
            )
        }
    }

    return required || value ? (
        label ? (
            <div className="top-bottom-padding">
                <span>
                    <strong>{label}: </strong>
                </span>
                {prefix}
                {type === 'date' && typeof value === 'string' ? (
                    <DateStr date={value} options={dateOptions} />
                ) : (
                    value
                )}
                {suffix}
            </div>
        ) : (
            <>
                {prefix}
                {type === 'date' && typeof value === 'string' ? (
                    <DateStr date={value} options={dateOptions} />
                ) : (
                    value
                )}
                {suffix}
            </>
        )
    ) : null
}

export default LabelValue
