import React from 'react'

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
}

interface DateStrProps {
    date: string
    locales?: string
    options?: Intl.DateTimeFormatOptions
}

const DateStr: React.FC<DateStrProps> = ({
    date,
    locales = 'en-us',
    options = {},
}) => {
    if (date) {
        return (
            <span>
                {new Date(date).toLocaleDateString(locales, {
                    ...DEFAULT_OPTIONS,
                    ...options,
                    timeZone: 'UTC',
                })}
            </span>
        )
    } else {
        return null
    }
}

export default DateStr
