import {FC, useState} from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

interface NumberInputProps {
  id: string,
  label: string,
  prefix: string,
  suffix: string,
  updateValue: (inputValue: string) => void,
  value: number,
  min: number,
  max: number
}

/**
 * A component for inputing a number
 * 
 * @param id The id for the underlying html input
 * @param label The component label
 * @param prefix Text to appear as a prefix to the NumberInput (e.g. "$" if the input
 * represents a number of dollars)
 * @param suffix Text to appear as a suffix to the NumberInput (e.g. "SqFt")
 * @param updateValue A function called whenever the user changes the 
 * input value. The function has the new input value as the sole arguement. 
 * @param value The input value
 */
const NumberInput: FC<NumberInputProps> = ({id, label, prefix="", suffix="", updateValue, value, min, max}) => {
  const [error, setError] = useState<string>('');

  const handleChange = (inputValue : string) => {
    if (typeof inputValue !== 'number') {
      setError('Input must be a string');
    } else if (inputValue < min) {
      setError('Input must be at least ' + min);
    } else if (inputValue > max) {
      setError('Input must be at most ' + max);
    } else {
      setError('');
    }
    updateValue(inputValue);
  };
  return (
    <InputGroup>
      {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
      <FloatingLabel className="mb-3" controlId={id} label={label}>
        <Form.Control onChange={event => handleChange(event.target.value)}
          type="number" value={value || ""} isInvalid={Boolean(error)}/>
          {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
      </FloatingLabel>
      {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
    </InputGroup>
  );
};

export default  NumberInput
