import React from 'react'
import DateStr from './date_str'

export interface LabelValueProps {
    label?: React.ReactNode
    value: React.ReactNode
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
    if (type === 'number' && typeof value === 'string') {
        function convertStringToNumber(input: string): number | null {
            const parsedNumber = Number(input)

            // Check if the parsed value is a valid number
            if (!isNaN(parsedNumber)) {
                return parsedNumber
            } else {
                return null
            }
        }
        const convertedValue = convertStringToNumber(value)
        if (convertedValue !== null) {
            value = convertedValue
        }
    }

    //If type is "number" and decimalPlaces, round the value
    if (type === 'number' && typeof value === 'number') {
        //check that value is actually a number
        //Need to do this because TS not currently configured for MDX files and there's a chance that
        //someone could try to .toFixed("some string") and cause an error
        if (
            typeof value === 'number' &&
            !isNaN(value) &&
            typeof decimalPlaces === 'number' &&
            !isNaN(decimalPlaces)
        ) {
            value = value.toFixed(decimalPlaces)
        } else {
            console.log(
                'Make sure that your value and decimalPlaces params are actually numbers.',
            )
        }
    } else if (type === 'number' && typeof value !== 'number') {
        console.log(
            `You are trying to set the type of a non-number value to 'number'. Value is : ${value} and typeof value is: ${typeof value}`,
        )
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
