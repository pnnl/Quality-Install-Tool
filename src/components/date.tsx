import React, { FC } from 'react';

/**
 * Interface for the DateStrProps
 */
interface DateStrProps {
    date: string,
    locals: string,
    options: Intl.DateTimeFormatOptions
}

/**
 * Default options for date formatting
 */
const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {timeZone: 'UTC', month:"long", day:"numeric", year:"numeric"};

/**
 * DateStr component
 * @param date - The date string
 * @param locals - The locals string for locale-specific formatting (default: 'en-us')
 * @param options - Additional options for date formatting (optional)
 * @returns The formatted date component
 */
const DateStr: FC<DateStrProps>= ({date, locals = 'en-us', options = {}}) => {
  const full_options = {...DEFAULT_OPTIONS, ...options};
  const parsedDate = new Date(date);
  const formattedDate = parsedDate.toLocaleDateString(locals, full_options);

  return <span>{formattedDate}</span>;
}

export default DateStr;