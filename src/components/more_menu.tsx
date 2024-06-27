import React, { useState, type FC } from 'react'
import { TfiMoreAlt } from 'react-icons/tfi'
import { Button, Fade } from 'react-bootstrap'

interface MenuProps {
    options: { url: string; name: string }[]
}

const Menu: FC<MenuProps> = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOverflowMenu = (event: React.MouseEvent) => {
        setIsOpen(prevIsOpen => !prevIsOpen)
        event.stopPropagation()
        event.preventDefault()
    }

    return (
        <div className="menu-container">
            <Button
                className="transparent-button"
                onClick={toggleOverflowMenu}
                aria-controls="menuitem"
                aria-expanded={isOpen}
            >
                <TfiMoreAlt />
            </Button>

            <Fade in={isOpen}>
                <div id="menuitem">
                    {options.map((option, index) => (
                        <div key={index}>{option.name}</div>
                    ))}
                </div>
            </Fade>
        </div>
    )
}

export default Menu
