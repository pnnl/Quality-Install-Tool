import { FC, ReactElement, ReactNode, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import Collapsible from './collapsible'
import React from 'react'
import { useDatabase } from '../providers/database_provider'

interface RepeatableProps {
    label: string
    path: string
    max: number
    count: number // Default number of repetition
    children: any
    fixed: boolean
    data?: any
    docId: string
}

// Define an extended props type that includes the `id` prop
interface CustomProps {
    id?: string
    path?: string
    label?: string
    children?: ReactNode
}

/**
 * Generates an array of keys from 'A1' to 'An', based on the provided number. Unique key for each repetition,
 * used internally to refer array element in the db doc
 * @param n - The number of keys to generate.
 * @returns An array of keys.
 */
function generateKeys(n: number) {
    const keys = []
    for (let i = 1; i <= n; i++) {
        // Construct the key as 'A' followed by the number
        const key = `A${i}`
        keys.push(key)
    }
    return keys
}

/**
 * A React component that renders a list of repeatable sections based on dynamic data.
 * Each section can be expanded or collapsed and includes child components.
 * The component allows users to add or remove sections dynamically.
 *
 * @param {string} label - The label to be displayed for each repeatable section.
 * @param {string} path - The path in the document where the repeatable data is stored.
 * @param {number} max - The maximum number of items that can be included.
 * @param {number} count - The initial number of items to display.
 * @param {React.ReactNode} children - The child components to be rendered inside each repeatable section.
 * @param {boolean} [fixed=true] - If true, prevents adding or removing items.
 *
 * @returns {JSX.Element} The rendered component.
 *
 *
 * Example usage; Repeats the components fixed {count} number of times
 *
 *  <RepeatableInput label='cc_test' max="3" count="3" path="user_information" fixed>
 *       <div>Enter your Information</div>
 *       <StringInput path="name" label="Please enter a name"/>
 *       <Radio path="work_location" label="Please Choose" options={['Home', 'Office']} />
 *  </RepeatableInput>
 *
 */

/** */
const RepeatableInput: FC<RepeatableProps> = ({
    label,
    path,
    max,
    count,
    children,
    fixed,
    data,
    docId,
}: RepeatableProps): JSX.Element => {
    const allowedKeys = generateKeys(max) // An array of keys generated based on the maximum number of keys allowed (`max`).
    const keysToInclude = allowedKeys.slice(0, count) // A subset of`allowedKeys`, sliced to include only the number specified by`count`.

    // An object created by reducing`keysToInclude`, where each key from `keysToInclude` is set to an empty object.
    const displayObjects = keysToInclude.reduce((acc: any, key) => {
        acc[key] = {} // Initialize each key with an empty object
        return acc
    }, {})

    const [items, setItems] = useState(displayObjects)
    const [itemKeys, setItemKeys] = useState<any[]>(Object.keys(items))
    const db = useDatabase()

    const fetchItems = async () => {
        try {
            const dataFromDB = data[path]
            if (dataFromDB && Object.keys(dataFromDB).length > 0) {
                if (!fixed) {
                    // When fixed is false, directly set items from the database
                    setItems(dataFromDB)
                    setItemKeys(Object.keys(dataFromDB))
                } else {
                    // For fixed state, merge with current items
                    setItems((prev: any) => ({ ...prev, ...dataFromDB }))
                    setItemKeys(prev =>
                        Array.from(
                            new Set([...prev, ...Object.keys(dataFromDB)]),
                        ),
                    )
                }
            }
        } catch (err) {
            console.error('Failed to fetch from DB:', err)
        }
    }

    // Fetch array of items from the database when component mounts
    useEffect(() => {
        fetchItems()
    }, [data])

    // Handler to add a new item
    const addNewItem = () => {
        const key_index = allowedKeys.find(key => !itemKeys.includes(key))
        if (!key_index) {
            console.error('No available key index found.')
            return
        }
        setItems((prev: any) => ({
            ...prev,
            [key_index]: {},
        }))
        setItemKeys((prev: any) => [...prev, key_index])
    }

    // Handler to remove an item
    const removeAnItem = async (item_key: string) => {
        const updatedItems = Object.fromEntries(
            Object.entries(items).filter(([key, _]) => key !== item_key),
        )

        try {
            const doc: any = await db.get(docId)
            const updatedData = { ...doc.data_, [path]: updatedItems }

            const attachments = doc._attachments

            // Prepare the updated document
            const updatedDoc = {
                ...doc,
                data_: updatedData,
                _rev: doc._rev,
            }

            // Remove the attachments, if any
            if (attachments)
                Object.keys(attachments).map(attachmentId => {
                    if (
                        attachmentId.includes(path + '.' + item_key) &&
                        doc._attachments[attachmentId]
                    ) {
                        delete doc._attachments[attachmentId]
                    }
                })
            if (updatedDoc)
                // Save the updated document back to the database
                await db.put(updatedDoc)
            fetchItems()
        } catch (err) {
            console.error('Failed to remove an element:', err)
        }
    }

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
            {itemKeys &&
                itemKeys.map((item_key: any, index) => (
                    <div key={item_key}>
                        <Collapsible
                            header={`${label}${' '}${index + 1} ${
                                items[item_key]?.appliance_type
                                    ? ': ' + items[item_key]?.appliance_type
                                    : ''
                            }`}
                        >
                            <div className="combustion_tests">
                                {React.Children.map(children, child =>
                                    cloneChildAndNestedChild(child, {
                                        path,
                                        item_key,
                                    }),
                                )}
                            </div>

                            <div>
                                {!fixed && (
                                    <Button
                                        onClick={() => removeAnItem(item_key)}
                                        className="remove-button"
                                    >
                                        Remove Item
                                    </Button>
                                )}
                            </div>
                            <div>&nbsp;</div>
                        </Collapsible>
                    </div>
                ))}
            {itemKeys.length < max && (
                <Button
                    variant="primary"
                    onClick={() => addNewItem()}
                    className="padding"
                >
                    Add more Item
                </Button>
            )}
        </div>
    )
}

export default RepeatableInput
