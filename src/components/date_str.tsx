import { isEmpty } from 'lodash'
import React, { FC } from 'react'

/**
 * Interface for the DateStrProps
 */
interface DateStrProps {
    date: string
    locals?: string
    options?: Intl.DateTimeFormatOptions
}

/**
 * Default options for date formatting
 */
const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
}

/**
 * DateStr component : Returns date only in UTC format
 * @param date - A string appropriate as the single argument to the Date() constructor
 * @param locals - An optional string used as the first argument to the Date.toLocalDateString() method (default: 'en-us')
 * @param options - An optional objected used as the second argument to the Date.toLocalDateString() method
 * @returns The formatted date component
 */
const DateStr: FC<DateStrProps> = ({
    date,
    locals = 'en-us',
    options = {},
}) => {
    const full_options = { ...DEFAULT_OPTIONS, ...options, timeZone: 'UTC' }
    const parsedDate = new Date(date)
    const formattedDate = parsedDate.toLocaleDateString(locals, full_options)
    return <span>{formattedDate}</span>
}

export default DateStr
