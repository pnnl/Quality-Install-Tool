import React from 'react'

interface LabelValueProps {
    label?: React.ReactNode
    value: React.ReactNode
    required?: boolean
    prefix?: React.ReactNode
    suffix?: React.ReactNode
}

const LabelValue: React.FC<LabelValueProps> = ({
    label,
    value,
    required = false,
    prefix = '',
    suffix = '',
}) => {
    if (required || value) {
        if (label) {
            return (
                <div className="top-bottom-padding">
                    <span>{label}: </span>
                    <strong>{value}</strong>
                </div>
            )
        } else {
            return (
                <>
                    {prefix}
                    {value}
                    {suffix}
                </>
            )
        }
    } else {
        return null
    }
}

export default LabelValue
