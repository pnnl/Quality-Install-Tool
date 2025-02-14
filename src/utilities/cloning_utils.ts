import React from 'react'

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
        const key = `${parentKey}-${index}`

        const id =
            el.props.id && parentPath
                ? `${parentPath}.${parentKey}.${el.props.id}`
                : undefined

        const path =
            el.props.path && parentPath
                ? `${parentPath}[${parentKey}].${el.props.path}`
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
                        path,
                    ),
            ),
        })
    } else {
        return el
    }
}
