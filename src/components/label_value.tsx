import React from 'react'
import DateStr from './date_str'

/**
 * LabelValueProps defines the props for the LabelValue component.
 *
 * @interface LabelValueProps
 * @property {string} label - The label to display next to the value.
 * @property {string} value - The value to display.
 * @property {boolean} [required=false] - A flag to determine if the label-value pair should be rendered.
 */
interface LabelValueProps {
    label?: string
    value?: string | number | boolean
    required?: boolean
    prefix?: string
    suffix?: string
    type: 'string' | 'number' | 'date' | 'boolean'
    decimalPlaces?: number
}

/**
 * LabelValue is a React functional component that displays a label-value pair
 * by retrieving the value from a context (StoreContext) based on the provided `path`.
 *
 * If the `required` prop is true, it will render the label and its corresponding value,
 * otherwise label-value will be rendered only if value is not empty.
 *
 * @param {LabelValueProps} props - The props for the LabelValue component.
 * @returns {JSX.Element | null} A JSX element containing the label and value, or null if `required` is false.
 *
 * @example
 * // Renders the label and value from the store context if required is true.
 * <LabelValue label="Username" path="user.username" required={true} />
 */
const LabelValue: React.FC<LabelValueProps> = ({
    label,
    value,
    required = false,
    prefix = '',
    suffix = '',
    decimalPlaces = 1,
    type = 'string',
}: LabelValueProps): JSX.Element | null => {
    //If type is "number" and decimalPlaces, round the value
    if (type === 'number' && typeof value === 'number') {
        // debugger
        //check that value is actually a number
        //Need to do this because TS can't do its job in MDX files and there's a chance that
        //someone could pass bad values in via props

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

    if (type === 'boolean' && typeof value === 'boolean') {
        if (value) {
            value = 'YES'
        } else {
            value = 'NO'
        }
    } else if (type === 'boolean' && typeof value !== 'boolean') {
        console.log(
            `You are trying to set the type of a non-boolean value to 'yes' or 'no'. Value is : ${value} and typeof value is: ${typeof value}`,
        )
    }

    return required || value ? (
        label ? (
            <div className="top-bottom-padding">
                <span>{label}: </span>
                <strong>{value}</strong>
            </div>
        ) : (
            <>
                {prefix}
                {type === 'date' && typeof value === 'string' ? (
                    <DateStr date={value} />
                ) : (
                    value
                )}
                {suffix}
            </>
        )
    ) : null
}

export default LabelValue
