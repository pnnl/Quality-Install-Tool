import React, { FC, ReactNode } from 'react'
import { StoreContext } from './store'
import { get } from 'lodash'

interface ShowOrHideProps {
    children: ReactNode
    visible: boolean
    path?: string
    value?: string
}

/**
 * `ShowOrHide` is a React component that conditionally renders its children based on
 * the `visible` prop and optionally checks a value from the `StoreContext` against
 * a specified path.
 *
 * @param {Object} props - The component's props.
 * @param {React.ReactNode} props.children - The children elements to be conditionally rendered.
 * @param {boolean} props.visible - A boolean that directly determines if the children should be shown.
 * @param {string} [props.path] - An optional path to check within the context's data.
 * @param {any} [props.value] - An optional value to compare against the value at the specified path.
 *
 * @returns {React.ReactElement} The rendered component.
 */
const ShowOrHide: FC<ShowOrHideProps> = ({
    children,
    visible,
    path,
    value,
}: {
    children: React.ReactNode
    visible: boolean
    path?: string
    value?: any
}): React.ReactElement => {
    /* Conditionally render children based on 'visible' */
    return (
        <StoreContext.Consumer>
            {({ data }) => {
                const isVisible =
                    visible || (path && value && get(data, path) === value)
                return <>{isVisible && children}</>
            }}
        </StoreContext.Consumer>
    )
}

export default ShowOrHide
