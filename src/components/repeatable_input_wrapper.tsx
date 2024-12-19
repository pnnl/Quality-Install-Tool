import { FC, useEffect, useState } from 'react'
import { StoreContext } from './store'
import { retrieveDocFromDB, useDB } from '../utilities/database_utils'
import RepeatableInput from './repeatable_input'

interface RepeatableInputWrapperProps {
    label: string
    path: string
    children: any
    parent?: any
    max?: number
    count?: number
    fixed?: boolean
}

/**
 * A wrapper component for rendering repeatable input elements that are linked to a database document.
 *
 * This component listens for changes in a database and automatically updates its content when the
 * associated document changes. It can either render data from a parent (project) document (if provided) or
 * fetch data from the child (installation) document. The component ensures that input fields are dynamically
 * created and updated in real-time, based on database changes.
 *
 * @param {string} label - The label for the repeatable input, typically used for display or identification.
 * @param {string} path - The path used to access data in the context or database document.
 * @param {React.ReactNode} children - The child components that will be rendered inside the RepeatableInput component.
 * @param {any} [parent] - An optional parent document that can be used to override the default data source.
 *                        If provided, the parent document will be fetched and its data will be used.
 * @param {number} [max=5] - The maximum number of repeatable inputs to render. Defaults to 5.
 * @param {number} [count=1] - The initial count or number of input fields to display. Defaults to 1.
 * @param {boolean} [fixed=false] - Whether the input fields should have a fixed count (i.e., no additional inputs can be added). Defaults to false.
 *
 * @returns {JSX.Element} - A RepeatableInput component wrapped in context that automatically updates based on database changes.
 *
 */
const RepeatableInputWrapper: FC<RepeatableInputWrapperProps> = ({
    label,
    path,
    children,
    parent,
    max = 5,
    count = 1,
    fixed = false,
}: RepeatableInputWrapperProps): JSX.Element => {
    const [parentDoc, setParentDoc] = useState(parent)
    const db = useDB()

    useEffect(() => {
        if (parent) setParentDoc(parent)
        const changes = db
            .changes({
                live: true,
                since: 'now',
                include_docs: true,
            })
            .on('change', () => {
                // Call retrieveDocFromDB() when a change is detected in DB
                if (parent)
                    retrieveDocFromDB(db, parent?._id).then(doc =>
                        setParentDoc(doc),
                    )
            })
            .on('error', (err: any) => {
                console.error('Changes feed error:', err)
            })

        // Clean up the change listener when the component unmounts
        return () => {
            changes.cancel()
        }
    }, [])

    return (
        <StoreContext.Consumer>
            {({ data, docId }) => {
                const dataFromDoc = parent ? parentDoc.data_ : data
                return (
                    <RepeatableInput
                        path={path}
                        label={label}
                        data={dataFromDoc}
                        docId={parent ? parent?._id : docId}
                        max={max}
                        count={count}
                        fixed={fixed}
                    >
                        {children}
                    </RepeatableInput>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default RepeatableInputWrapper
