import type { FC } from 'react'

import type { TimestampSource } from '../types/photo_metadata.type'

/**
 * Interface for the DateTimeStrProps
 */
interface DateTimeStrProps {
    date: string
    source?: TimestampSource | null
    locals?: string
    options?: Intl.DateTimeFormatOptions
}

/**
 * Default options for date formatting
 */
const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    timeZoneName: 'short',
    year: 'numeric',
}

/**
 * DateTimeStr component
 * @param date - A string appropriate as the single argument to the Date() constructor
 * @param locals - An optional string used as the first argument to the Date.toLocalDateString() method (default: 'en-us')
 * @param options - An optional objected used as the second argument to the Date.toLocalDateString() method
 * @returns The formatted date component
 */
const DateStr: FC<DateTimeStrProps> = ({
    date,
    source,
    locals = 'en-us',
    options = {},
}) => {
    const fullOptions = { ...DEFAULT_OPTIONS, ...options }
    const parsedDate = new Date(date)
    const formattedDate = parsedDate.toLocaleString(locals, fullOptions)

    return <span>{formattedDate}</span>
}

export default DateStr
