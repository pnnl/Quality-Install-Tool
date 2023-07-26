import { isEmpty } from 'lodash';
import React, { FC } from 'react';

/**
 * Interface for the DateStrProps
 */
interface DateStrProps {
  date: string,
  locals?: string,
  options?: Intl.DateTimeFormatOptions
}

/**
 * Default options for date formatting
 */
const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric"
};

/**
 * getDate function: Returns Date() object from the date string of format ('YYYY-MM-DD')
 * @param dateStr : Input from the template
 * @returns : Date() 
 */
function getDate(dateStr: string): Date {
  if (isEmpty(dateStr)) return new Date(dateStr)
  const dateArray = dateStr.split("-")
  const _entryDate = new Date(parseInt(dateArray[0]), parseInt(dateArray[1], 10) - 1, parseInt(dateArray[2]))
  return _entryDate
}

/**
 * DateStr component
 * @param date - A string appropriate as the single argument to the Date() constructor
 * @param locals - An optional string used as the first argument to the Date.toLocalDateString() method (default: 'en-us')
 * @param options - An optional objected used as the second argument to the Date.toLocalDateString() method
 * @returns The formatted date component
 */
const DateStr: FC<DateStrProps> = ({ date, locals = 'en-us', options = {} }) => {
  const full_options = { ...DEFAULT_OPTIONS, ...options }
  const parsedDate = getDate(date)
  const formattedDate = parsedDate.toLocaleString(locals, full_options)
  return <span>{formattedDate}</span>
}

export default DateStr
