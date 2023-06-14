import { SetStateAction, useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

interface InputModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSubmit: (input: string) => void;
}

const InputModal: React.FC<InputModalProps> = ({
    isOpen,
    closeModal,
    onSubmit,
  }) =>  {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        // Call each function in the onSubmit array
        onSubmit(inputValue);
        closeModal();
    };
  
    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
      setInputValue(event.target.value);
    };
  
    return (
      <Modal
        show={isOpen}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  export default InputModal;