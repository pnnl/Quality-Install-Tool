import { FC, ReactElement, ReactNode, useEffect, useState } from 'react'
import React from 'react'

interface RepeatableProps {
    label: string
    path: string
    children: any
    data?: any
}

// Define an extended props type that includes the `id` prop
interface CustomProps {
    id?: string
    path?: string
    label?: string
    children?: ReactNode
    fromParent?: string
    docId?: string
}

/**
 * `Repeatable` is a React FC that allows rendering a collection of repeatable elements based on data from a parent component or a database.
 * The component receives an array of children and dynamically clones them with updated props for each item in the data collection.
 * The data collection is expected to be an object, where each key represents a repeatable item.
 *
 * @param {string} label - A label to be used within the component (could be displayed as a title or header).
 * @param {string} path - A path that helps identify the specific data structure in the parent component or database.
 * @param {ReactNode} children - The child elements to be rendered and repeated based on the items in the data collection.
 * @param {any} [data] - Optional. A data object containing the items to be rendered, structured based on the path provided.
 *
 * @returns {JSX.Element} - A React element that renders the repeated elements based on the `data` prop,
 *                          with updated `path` and `id` for each child component.
 *
 * @example
 * ```tsx
 * <Repeatable label="Appliances" path="appliances" data={applianceData}>
 *   <StringInput label="Appliance Name" path="name" />
 *   <StringInput label="Appliance Type" path="type" />
 * </Repeatable>
 * ```
 * In this example, the `StringInput` will be cloned for each item in the `applianceData` object,
 * with the `path` prop dynamically updated to access each item's respective properties.
 */

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
            const appliances_data = dbData[path]
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
