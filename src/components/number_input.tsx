import {FC} from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

interface NumberInputProps {
  id: string,
  label: string,
  prefix: string,
  suffix: string,
  updateValue: (inputValue: string) => void,
  value: number
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
const NumberInput: FC<NumberInputProps> = ({id, label, prefix="", suffix="", updateValue, value}) => {
  return (
    <InputGroup>
      {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
      <FloatingLabel className="mb-3" controlId={id} label={label}>
        <Form.Control onChange={event => updateValue(event.target.value)}
          type="number" value={value || ""}/>
      </FloatingLabel>
      {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
    </InputGroup>
  );
};

export default  NumberInput
