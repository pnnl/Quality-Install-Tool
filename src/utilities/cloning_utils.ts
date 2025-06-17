import React from 'react'

// @note Excluded components.
//     If a component name is excluded, then its `path` prop is not accumulated
//     when its child elements are cloned.
const EXCLUDED_COMPONENT_NAMES: string[] = [
    'Collapsible',
    'FigureWrapper',
    'InstallationConsumer',
    'InstallationProvider',
    'PrintSectionWrapper',
    'ShowOrHideWrapper',
    'StoreProvider',
    'TabWrapper',
    'TableWrapper',
    'Tabs',
    'CollapsibleTextWrapper',
]

export interface CloneableProps {
    id?: string
    path?: string
    children?: React.ReactNode
}

export function cloneElement<T extends CloneableProps>(
    el: React.ReactElement<T>,
    index: number,
    parentKey: React.Key,
    parentPath?: string,
): React.ReactNode {
    if (React.isValidElement(el)) {
        const isExcludedComponent =
            typeof el.type === 'function'
                ? EXCLUDED_COMPONENT_NAMES.includes(el.type.name)
                : false

        const key = `${parentKey}-${index}`

        const id =
            el.props.id && parentPath
                ? `${parentPath}.${el.props.id}`
                : undefined

        const path =
            el.props.path && parentPath
                ? `${parentPath}.${el.props.path}`
                : undefined

        return React.cloneElement(el, {
            ...el.props,
            key,
            id,
            path,
            children: React.Children.map(
                el.props.children,
                (child, childIndex) =>
                    cloneElement<T>(
                        child as React.ReactElement<T>,
                        childIndex,
                        key,
                        isExcludedComponent ? parentPath : path,
                    ),
            ),
        })
    } else {
        return el
    }
}
