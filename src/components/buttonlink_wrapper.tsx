import { FC } from 'react'

import { StoreContext } from './store'
import { pathToId } from '../utilities/paths_utils'
import ButtonLink from './buttonlink'

interface ButtonLinkWrapperProps {
    label: string
    options: string[]
    path: string
    href: string
}

const ButtonLinkWrapper: FC<ButtonLinkWrapperProps> = ({
    label,
    options,
    path,
    href,
}) => {
    // Generate an id for the input
    const id = pathToId(path, 'input')

    return (
        <StoreContext.Consumer>
            {({ data, upsertData }) => {
                return (
                    <ButtonLink
                        id={id}
                        label={label}
                        options={options}
                        href={href}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default ButtonLinkWrapper
