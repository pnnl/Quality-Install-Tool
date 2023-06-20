import { title } from 'process';
import { SetStateAction, useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

/**
 * Props for the StringInputModal component.
 */
interface StringInputModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSubmit: (input: string) => void;
    validateInput: Array<{ validator: (input: string) => boolean; errorMsg: string }>;
    title: string
}

/**
 * Modal component with an input field for string input.
 * @param {StringInputModalProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const StringInputModal: React.FC<StringInputModalProps> = ({
    isOpen,
    closeModal,
    onSubmit,
    validateInput,
    title,
  }) =>  {
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = () => {
      const isValid = validateInput.every((validator) => validator.validator(inputValue));
  
      if (isValid) {
        onSubmit(inputValue);
        closeModal();
        setErrorMessage('');
      } else {
        setErrorMessage(validateInput.find((validator) => !validator.validator(inputValue))?.errorMsg || '');
      }
    };
  
    /**
     * Handles the change in the input field value.
     * @param {Object} event - The input change event.
     */
    const handleInputChange = (event: { target: { value: SetStateAction<string> } }) => {
      setInputValue(event.target.value);
      setErrorMessage('');
    };
  
    return (
      <Modal show={isOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" value={inputValue} onChange={handleInputChange} />
          {errorMessage && <div className="error">{errorMessage}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  export default StringInputModal;