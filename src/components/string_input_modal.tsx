import { SetStateAction, useState } from 'react'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import PropTypes from 'prop-types'

/**
 * Props for the StringInputModal component.
 */
interface StringInputModalProps {
    isOpen: boolean
    closeModal: () => void
    onSubmit: (input: string) => void
    validateInput: Array<{
        validator: (input: string) => boolean
        errorMsg: string
    }>
    title: string
    okButton: string
    value: string
}

/**
 * Modal component with an input field for string input.
 * @param {StringInputModalProps} props - The component receives several props:
 *    isOpen: Indicates whether the mvalidateInput.findodal is open or closed.
 *    closeModal: A callback function to close the modal.
 *    onSubmit: A callback function invoked when the user submits the input value.
 *    validateInput: An array of validators for input validation. Each validator is an object with a validator function and an errorMsg string.
 *    title: The title of the modal.
 *    okButton: the message appare for the ok button.
 * @returns {JSX.Element} The rendered component.
 */
const StringInputModal: React.FC<StringInputModalProps> = ({
    isOpen,
    closeModal,
    onSubmit,
    validateInput,
    title,
    okButton,
    value,
}) => {
    const [inputValue, setInputValue] = useState(value)
    const [errorMessage, setErrorMessage] = useState('')
    const [isValid, setIsValid] = useState(false)

    const handleSubmit = () => {
        onSubmit(inputValue.trim())
        closeModal()
    }

    const handleKeyPress = (target: KeyboardEvent) => {
        if (target.key === 'Enter') {
            isValid && handleSubmit()
        }
    }

    /**
     * Handles the change in the input field value.
     * @param {Object} event - The input change event.
     */
    const handleInputChange = (event: { target: { value: string } }) => {
        let input = event.target.value
        setInputValue(input)
        setIsValid(validateInput.every(validator => validator.validator(input)))
    }

    /**
     * Determining the specific error message based on the input field's value.
     * Uses state variables 'isValid' and 'inputValue'.
     */
    const evalErrorMessage = () => {
        setErrorMessage('')
        if (!isValid) {
            const errorValidator = validateInput.find(
                validator => !validator.validator(inputValue),
            )
            const errorMessage = errorValidator?.errorMsg || ''
            setErrorMessage(errorMessage)
        }
    }

    const modalTitle = title || 'Default Title'
    const modalOK = okButton || 'OK'

    return (
        <Modal
            show={isOpen}
            onHide={closeModal}
            onKeyPress={handleKeyPress}
            className="string-input-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyUp={evalErrorMessage}
                    autoFocus
                />
                {errorMessage && <div className="error">{errorMessage}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSubmit} disabled={!isValid}>
                    {modalOK}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default StringInputModal
