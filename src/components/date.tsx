import React, { FC } from 'react';

interface MyDateProps {
    dateparam: string,
    locals: string,
    options: any
  }

const MyDate: FC<MyDateProps>= ({dateparam, locals = 'en-us', options = {timeZone: 'UTC', month:"long", day:"numeric", year:"numeric"}}) => {
  const date = new Date(dateparam);
  const formattedDate = date.toLocaleDateString(locals, options);

  return <span>{formattedDate}</span>;
}

export default MyDate;