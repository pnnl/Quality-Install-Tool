import React from 'react'

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    timeZoneName: 'short',
    year: 'numeric',
}

interface DateTimeStrProps {
    date: string
    locales?: string
    options?: Intl.DateTimeFormatOptions
}

const DateTimeStr: React.FC<DateTimeStrProps> = ({
    date,
    locales = 'en-us',
    options = {},
}) => {
    if (date) {
        return (
            <span>
                {new Date(date).toLocaleString(locales, {
                    ...DEFAULT_OPTIONS,
                    ...options,
                })}
            </span>
        )
    } else {
        return null
    }
}

export default DateTimeStr
