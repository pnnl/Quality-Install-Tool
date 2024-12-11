import { FC, useEffect, useState } from 'react'
import { StoreContext } from './store'
import Repeatable from './repeatable'
import { retrieveDocFromDB, useDB } from '../utilities/database_utils'

interface RepeatableWrapperProps {
    label: string
    path: string
    children: any
    parent?: any
}

/**
 * A wrapper component for rendering repeatable elements that are linked to a database document.
 *
 * This component listens for changes in a database and automatically updates its content when the
 * associated document changes. It can either render data from a parent document (if provided) or
 * fetch data from the installation document. The component ensures that updates are reflected in real-time.
 *
 * @param {string} label - The label for the repeatable element, typically used for display or identification.
 * @param {string} path - The path used to access data in the context or database document.
 * @param {React.ReactNode} children - The child components that will be rendered inside the Repeatable component.
 * @param {any} [parent] - An optional parent document that can be used to override the default data source.
 *                        If provided, the parent (i.e., project) document will be fetched and its data will be used.
 *
 * @returns {JSX.Element} - A Repeatable component wrapped in context that automatically updates based on database changes.
 */
const RepeatableWrapper: FC<RepeatableWrapperProps> = ({
    label,
    path,
    children,
    parent,
}: RepeatableWrapperProps): JSX.Element => {
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
    }, [parentDoc])

    return (
        <StoreContext.Consumer>
            {({ data }) => {
                const dataFromDoc = parent ? parentDoc.data_ : data
                return (
                    <Repeatable path={path} label={label} data={dataFromDoc}>
                        {children}
                    </Repeatable>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default RepeatableWrapper
