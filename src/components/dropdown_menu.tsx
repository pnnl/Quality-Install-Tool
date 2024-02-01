import type { FC } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'

interface DropdownProps {
    id: string
    label: string
    value: string
}

const DropDownMenu: FC<DropdownProps> = ({
    id,
    label,
    value,
}

) => {
    return (
        <>
            <DropdownButton id={id} title={label}>


                <Dropdown.Item href="#/action-1">WorkFlow 1</Dropdown.Item>
                <Dropdown.Item href="#/action-2">WorkFlow 2</Dropdown.Item>
                <Dropdown.Item href="#/action-3">WorkFlow 3</Dropdown.Item>
            </DropdownButton>
        </>
    )
}

export default DropDownMenu
