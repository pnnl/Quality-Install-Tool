import PouchDB from 'pouchdb'
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

import { useDatabase } from './database_provider'
import { type Project } from '../types/database.types'
import { getProject } from '../utilities/database_utils'

export type ProjectDocument = PouchDB.Core.Document<Project> &
    PouchDB.Core.GetMeta

export const ProjectContext = createContext<
    [
        ProjectDocument | undefined,
        React.Dispatch<React.SetStateAction<ProjectDocument | undefined>>,
        () => Promise<void>,
    ]
>([undefined, () => {}, async () => {}])

export function useProject(): [
    ProjectDocument | undefined,
    React.Dispatch<React.SetStateAction<ProjectDocument | undefined>>,
    () => Promise<void>,
] {
    return useContext(ProjectContext)
}

interface ProjectProviderProps {
    projectId: PouchDB.Core.DocumentId | undefined
    attachments?: boolean | undefined
    children: React.ReactNode
}

const ProjectProvider: React.FC<ProjectProviderProps> = ({
    projectId,
    attachments,
    children,
}) => {
    const db = useDatabase()

    const [error, setError] = useState<PouchDB.Core.Error | undefined>(
        undefined,
    )

    const [project, setProject] = useState<ProjectDocument | undefined>(
        undefined,
    )

    const reloadProject = useCallback(async () => {
        if (projectId) {
            try {
                const project = await getProject(db, projectId, {
                    attachments,
                })

                setError(undefined)

                setProject(project)
            } catch (cause) {
                setError(cause as PouchDB.Core.Error)

                setProject(undefined)
            }
        } else {
            setError({})

            setProject(undefined)
        }
    }, [projectId])

    useEffect(() => {
        reloadProject()
    }, [reloadProject])

    if (error) {
        return (
            <div className="container">
                <p>Project not found.</p>
            </div>
        )
    } else {
        return (
            <ProjectContext.Provider
                value={[project, setProject, reloadProject]}
            >
                {children}
            </ProjectContext.Provider>
        )
    }
}

export default ProjectProvider
