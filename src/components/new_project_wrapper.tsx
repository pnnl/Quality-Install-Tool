import NewProjectForm from './new_project'
import { useLocation } from 'react-router-dom'
import { StoreProvider } from './store'

const NewProjectWrapper = () => {
    const location = useLocation()
    const extractIdFromURL = (url: string) => {
        const parts = url.split('/app/')
        return parts.length > 1 ? parts[1] : null
    }
    const docId = extractIdFromURL(location.pathname)
    if (!docId) return <div>Error: Cannot find document ID in the URL.</div>
    return (
        <StoreProvider
            dbName="quality-install-tool"
            docId={docId}
            workflowName={''}
            docName={''}
            type={'project'}
        >
            <NewProjectForm />
        </StoreProvider>
    )
}

export default NewProjectWrapper
