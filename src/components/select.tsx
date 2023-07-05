import React from 'react';
import {FC} from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'

interface SelectProps {
  id: string,
  label: string,
  options: string[],
  updateValue: (inputValue: string) => void,
  value: string
}

/**
 * Component for a select input
 * 
 * @param id The id for the underlying html input
 * @param label The component label
 * @param options An array of strings representing the options for the underlying select input
 * @param updateValue A function called whenever the user changes the 
 * input value. The function has the new input value as the sole argument. 
 * @param value The current value of the input
 */
const Select: FC<SelectProps> = ({id, label, options, updateValue, value}) => {
  return (
    <>
      <FloatingLabel className="mb-3" controlId={id} label={label}>
        <Form.Select onChange={event => updateValue(event.target.value)}
          value={value || ""}>
          <option key="" value=""/>
          {options.map(option => <option key={option} value={option}>{option}</option>)}
        </Form.Select>
      </FloatingLabel>
    </>
  );
};

export default Select
