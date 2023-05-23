import React, { FC } from 'react';

/**
 * Interface for the DateStr prop
 */
interface DateStr {
    date: string,
    locals: string,
    options: any
}

/**
 * Default options for date formatting
 */
const DEFAULT_OPTIONS = {timeZone: 'UTC', month:"long", day:"numeric", year:"numeric"};

/**
 * MyDate component
 * @param date - The date string
 * @param locals - The locals string for locale-specific formatting (default: 'en-us')
 * @param options - Additional options for date formatting (optional)
 * @returns The formatted date component
 */
const MyDate: FC<DateStr>= ({date, locals = 'en-us', options = {}}) => {
  const full_options = {...DEFAULT_OPTIONS, ...options};
  const parsedDate = new Date(date);
  const formattedDate = parsedDate.toLocaleDateString(locals, full_options);

  return <span>{formattedDate}</span>;
}

export default MyDate;