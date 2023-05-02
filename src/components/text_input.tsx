import {FC} from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'

interface TextInputProps {
  id: string,
  label: string,
  updateValue: (inputValue: string) => void,
  value: string
}

/**
 * A component for inputing multiline text
 * 
 * @param id The id for the underlying html input
 * @param label The component label
 * @param updateValue A function called whenever the user changes the 
 * input value. The function has the new input value as the sole arguement. 
 * @param value The input value
 */
const TextInput: FC<TextInputProps> = ({id, label, updateValue, value}) => {
  return (
    <>
      <FloatingLabel className="mb-3" controlId={id} label={label}>
        <Form.Control as="textarea" onChange={event => updateValue(event.target.value)}
          placeholder="A placeholder" value={value || ""}/>
      </FloatingLabel>
    </>
  );
};

export default TextInput
