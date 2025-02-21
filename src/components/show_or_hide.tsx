import React from 'react'

// The type for the match conditions (Excludes, Includes, Equals)
// 'Equals': This condition checks if the value at the specified path is exactly equal to the value.
// 'Excludes': This condition checks if the value at the specified path does not contain any of the values specified in the value prop.
// 'Includes': This condition checks if the value at the specified path contains any of the values in the value prop.
export type MatchConditions = 'Equals' | 'Excludes' | 'Includes'

// Helper function for handling of both single value and array
function toArray<T>(val: T | T[] | undefined): T[] {
    if (val) {
        return Array.isArray(val) ? val : [val]
    } else {
        return []
    }
}

// Helper function for handling match condition checks
function checkCondition<T>(
    pathValue: T,
    pathValueArray: T[],
    valueArray: T[],
    condition: MatchConditions,
): boolean {
    if (!pathValue || pathValueArray.length == 0) {
        return false
    }

    switch (condition) {
        case 'Includes':
            // Check if all values in pathValue are included in valueArray
            return pathValueArray.every(val => valueArray.includes(val))
        case 'Excludes':
            // Check if none of the values in pathValue are included in valueArray
            return pathValueArray.every(val => !valueArray.includes(val))
        case 'Equals':
            // Check if all values in valueArray are included in pathValueArray
            return valueArray.every(val => pathValueArray.includes(val))
        default:
            return false
    }
}

interface ShowOrHideProps {
    children: React.ReactNode
    visible: boolean
    pathValue?: string
    value?: string | string[] // value can be a single string or an array of strings
    matchCondition?: MatchConditions // Optional condition (default: 'Equals')
}

/**
 * `ShowOrHide` is a React component that conditionally renders its children based on the `visible` prop
 * and optionally checks a value from the `StoreContext` or a parent document against a specified path.
 *
 * If the `visible` prop is `true`, the children will always be rendered. If `visible` is `false`, the component
 * will check the specified `path` within the context data or parent data and compare it to the `value` prop.
 * If the value at the `path` matches the value prop (or if the value is in the list), the children will be rendered. Otherwise, the children are hidden.
 *
 * @param {React.ReactNode} children - The child components to be conditionally rendered.
 * @param {boolean} visible - A boolean that directly determines whether the children should be rendered.
 * @param {string} [path] - An optional path to check within the context's data.
 * @param {any} [value] - An optional value (can be a string or an array of strings) to compare against the value at the specified `path` in the context data.
 * @param {any} [parent] - An optional parent document, used to override the context data if provided.
 * @param {string} [matchCondition] - A condition that determines how to compare values ('Includes', 'Excludes', or 'Equal'). Default is 'Equals'
 *
 * @returns {React.ReactElement} - The rendered component, either the children or null, based on the visibility logic.
 *
 * Examples:
 *
 * <ShowOrHide visible={true}>
 *   <p>This content is always visible.</p>
 * </ShowOrHide>
 *
 * <ShowOrHide path="role" value="admin" matchCondition="Equals">
 *   <p>This content is visible if the role is 'admin'.</p>
 * </ShowOrHide>
 *
 * <ShowOrHide path="roles" value={['admin', 'manager']} matchCondition="Includes">
 *   <p>This content is visible if the roles include 'admin' or 'manager'.</p>
 * </ShowOrHide>
 *
 * <ShowOrHide path="roles" value="admin" matchCondition="Excludes">
 *   <p>This content is visible if the role is not 'admin'.</p>
 * </ShowOrHide>
 *
 * <ShowOrHide path="roles" value="{['admin', 'manager']}" matchCondition="Excludes">
 *   <p>This content is visible if the role is not 'admin' or 'manager'.</p>
 * </ShowOrHide>
 */
const ShowOrHide: React.FC<ShowOrHideProps> = ({
    children,
    visible,
    pathValue,
    value,
    matchCondition = 'Equals',
}) => {
    return visible ||
        checkCondition(
            pathValue,
            toArray(pathValue),
            toArray(value),
            matchCondition,
        )
        ? children
        : null
}

export default ShowOrHide
