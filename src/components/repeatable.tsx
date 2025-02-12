import { FC, ReactElement, ReactNode, useEffect, useState } from 'react'
import React from 'react'

import { type BaseData } from '../types/database.types'

interface RepeatableProps {
    label: string
    path: string
    children: any
    data?: BaseData
}

// Define an extended props type that includes the `id` prop
interface CustomProps {
    id?: string
    path?: string
    label?: string
    children?: ReactNode
    fromParent?: string
    docId?: string | undefined
}

const Repeatable: FC<RepeatableProps> = ({
    label,
    path,
    children,
    data,
}: RepeatableProps): JSX.Element => {
    const [dbData, setDbData] = useState(data)
    const [items, setItems] = useState<any>({})
    const [itemsKeys, setItemsKeys] = useState<any[]>(Object.keys(items))

    const fetchAppliances = async () => {
        try {
            const appliances_data = (dbData as any)?.[path]
            if (appliances_data && Object.keys(appliances_data).length > 0) {
                setItems(appliances_data)
                setItemsKeys(Object.keys(appliances_data))
            }
        } catch (err) {
            console.error('Failed to fetch appliances:', err)
        }
    }

    // Fetch appliances from the database when component mounts
    useEffect(() => {
        if (data) setDbData(data)
        fetchAppliances()
    }, [data, dbData])

    const cloneChildAndNestedChild = (
        child: ReactElement<CustomProps>,
        {
            path,
            item_key,
        }: {
            path: string
            item_key: string
        },
    ): React.ReactNode => {
        if (React.isValidElement(child)) {
            // Enhance child props
            return React.cloneElement(child, {
                key: `${item_key}-${child.props.label}`,
                id: `${path}.${item_key}.${child.props.id}`,
                path: `${path}[${item_key}].${child.props.path}`,
                children: React.Children.map(
                    child.props.children,
                    nestedChild =>
                        cloneChildAndNestedChild(
                            nestedChild as ReactElement<CustomProps>,
                            {
                                path,
                                item_key,
                            },
                        ),
                ),
            })
        }
        return child
    }

    return (
        <div>
            {itemsKeys &&
                itemsKeys.map((item_key: string, index: number) => (
                    <div key={item_key}>
                        <div>
                            {React.Children.map(children, child =>
                                cloneChildAndNestedChild(child, {
                                    path,
                                    item_key,
                                }),
                            )}
                        </div>
                        <br />
                    </div>
                ))}
        </div>
    )
}

export default Repeatable
