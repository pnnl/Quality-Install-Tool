import React, { FC, ReactNode, useState } from 'react'
import { StoreContext } from './store'
import { get } from 'lodash'

interface ShowOrHideProps {
    children: ReactNode
    visible: boolean
    path?: string
    value?: string
    parent?: any
}

/**
 * `ShowOrHide` is a React component that conditionally renders its children based on the `visible` prop
 * and optionally checks a value from the `StoreContext` or a parent document against a specified path.
 *
 * If the `visible` prop is `true`, the children will always be rendered. If `visible` is `false`, the component
 * will check the specified `path` within the context data or parent data and compare it to the `value` prop.
 * If the value at the `path` matches the `value` prop, the children will be rendered. Otherwise, the children are hidden.
 *
 * @param {React.ReactNode} children - The child components to be conditionally rendered.
 * @param {boolean} visible - A boolean that directly determines whether the children should be rendered.
 * @param {string} [path] - An optional path to check within the context's data.
 * @param {any} [value] - An optional value to compare against the value at the specified `path` in the context data.
 * @param {any} [parent] - An optional parent document, used to override the context data if provided.
 *
 * @returns {React.ReactElement} - The rendered component, either the children or null, based on the visibility logic.
 *
 * @example
 * <ShowOrHide visible={true}>
 *   <p>This content is always visible</p>
 * </ShowOrHide>
 *
 * <ShowOrHide path="role" value="installer">
 *   <p>This content is visible only if the user's role is 'installer'</p>
 * </ShowOrHide>
 */
const ShowOrHide: FC<ShowOrHideProps> = ({
    children,
    visible,
    path,
    value,
    parent,
}: ShowOrHideProps): React.ReactElement => {
    /* Conditionally render children based on 'visible' */
    const [parentData, _] = useState<any>(parent?.data_)
    return (
        <StoreContext.Consumer>
            {({ data }) => {
                const data_object = parent ? parentData : data
                const isVisible =
                    visible ||
                    (path && value && get(data_object, path) === value)
                return <>{isVisible && children}</>
            }}
        </StoreContext.Consumer>
    )
}

export default ShowOrHide
