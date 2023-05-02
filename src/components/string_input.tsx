import {FC} from 'react'
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
  return (
    <>
      <FloatingLabel className="mb-3" controlId={id} label={label}>
        <Form.Control onChange={event => updateValue(event.target.value)}
          type="text" value={value || ""}/>
      </FloatingLabel>
    </>
  );
};

export default StringInput
