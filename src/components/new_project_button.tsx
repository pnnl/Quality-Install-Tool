import React, { useCallback } from 'react'
import { Button } from 'react-bootstrap'

interface NewProjectButtonProps {
    label: string
    onClick: () => void | Promise<void>
}

const NewProjectButton: React.FC<NewProjectButtonProps> = ({
    label,
    onClick,
}) => {
    const handleClick = useCallback(
        async (
            event: React.MouseEvent<HTMLButtonElement>,
        ): Promise<boolean> => {
            event.stopPropagation()
            event.preventDefault()

            onClick && (await onClick())

            return false
        },
        [onClick],
    )

    return (
        <Button onClick={handleClick} alt-text={label}>
            {label}
        </Button>
    )
}

export default NewProjectButton
