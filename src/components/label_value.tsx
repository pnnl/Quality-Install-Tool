import React from 'react'

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
    value: string
    required?: boolean
    prefix?: string
    suffix?: string
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
}: LabelValueProps): JSX.Element | null => {
    return required || value ? (
        label ? (
            <div className="top-bottom-padding">
                <span>{label}: </span>
                <strong>{value}</strong>
            </div>
        ) : (
            <>
                {prefix}
                {value}
                {suffix}
            </>
        )
    ) : null
}

export default LabelValue
