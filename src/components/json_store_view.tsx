import type { FC } from 'react'
import { useParams } from 'react-router-dom'

import { StoreContext, StoreProvider } from './store'
import { useDatabase } from '../providers/database_provider'

interface JsonStoreViewProps {
    project: any
}

/**
 * A component that provides a simple JSON view of the data store
 *
 * @remarks
 * The document Id for the instance is taken from a dynamic segment
 * of the route, :docId.
 *
 * @param dbName - The database name associated with an MDX template
 */
const JsonStoreView: FC<JsonStoreViewProps> = ({ project }) => {
    const db = useDatabase()

    const { installationId } = useParams()

    return installationId ? (
        <StoreProvider
            db={db}
            docId={project?._id}
            workflowName=""
            docName={''}
            type={''}
        >
            <StoreContext.Consumer>
                {({ attachments, data }) => {
                    return (
                        <>
                            Document:
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                            Attachments:
                            <pre>{JSON.stringify(attachments, null, 2)}</pre>
                        </>
                    )
                }}
            </StoreContext.Consumer>
        </StoreProvider>
    ) : null
}

export default JsonStoreView
