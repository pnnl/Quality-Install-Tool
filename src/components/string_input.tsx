import {FC, useState} from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'

interface StringInputProps {
  id: string,
  label: string,
  updateValue: (inputValue: string) => void,
  value: string
}

/**
 * A component for inputing a string
 * 
 * @param id The id for the underlying html input
 * @param label The component label
 * @param updateValue A function called whenever the user changes the 
 * input value. The function has the new input value as the sole arguement. 
 * @param value The input value
 */
const StringInput: FC<StringInputProps> = ({id, label, updateValue, value}) => {
  const [error, setError] = useState<string>('');

  const handleChange = (inputValue : string) => {
    if (typeof inputValue !== 'string') {
      setError('Input must be a string');
    } else if (inputValue.length < 5) {
      setError('Input must be at least 5 characters long');
    } else if (inputValue.length > 1000) {
      setError('Input must be at most 1000 characters long');
    } else {
      setError('');
    }
    updateValue(inputValue);
  };
  return (
    <>
      <FloatingLabel className="mb-3" controlId={id} label={label}>
        <Form.Control onChange={event => handleChange(event.target.value)}
          type="text" value={value || ""} isInvalid={Boolean(error)}/>
          {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
      </FloatingLabel>
    </>
  );
};

export default StringInput
