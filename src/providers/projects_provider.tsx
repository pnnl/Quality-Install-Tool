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
import { type Comparator } from '../utilities/comparison_utils'
import { getProjects } from '../utilities/database_utils'

export type ProjectDocument = PouchDB.Core.ExistingDocument<Project> &
    PouchDB.Core.AllDocsMeta

export const ProjectsContext = createContext<
    [
        Array<ProjectDocument>,
        React.Dispatch<React.SetStateAction<Array<ProjectDocument>>>,
        () => Promise<void>,
    ]
>([[], () => {}, async () => {}])

export function useProjects(): [
    Array<ProjectDocument>,
    React.Dispatch<React.SetStateAction<Array<ProjectDocument>>>,
    () => Promise<void>,
] {
    return useContext(ProjectsContext)
}

interface ProjectsProviderProps {
    projectComparator?: Comparator<ProjectDocument>
    attachments?: boolean | undefined
    children: React.ReactNode
}

const ProjectsProvider: React.FC<ProjectsProviderProps> = ({
    projectComparator,
    attachments,
    children,
}) => {
    const db = useDatabase()

    const [error, setError] = useState<PouchDB.Core.Error | undefined>(
        undefined,
    )

    const [projects, setProjects] = useState<Array<ProjectDocument>>([])

    const reloadProjects = useCallback(async () => {
        try {
            const projects = await getProjects(db, {
                attachments,
                binary: attachments ? true : undefined,
            })

            setError(undefined)

            if (projectComparator) {
                setProjects(projects.sort(projectComparator))
            } else {
                setProjects(projects)
            }
        } catch (cause) {
            setError(cause as PouchDB.Core.Error)

            setProjects([])
        }
    }, [attachments, db, projectComparator])

    useEffect(() => {
        reloadProjects()
    }, [reloadProjects])

    if (error) {
        return (
            <div className="container">
                <p>Projects not found.</p>
            </div>
        )
    } else {
        return (
            <ProjectsContext.Provider
                value={[projects, setProjects, reloadProjects]}
            >
                {children}
            </ProjectsContext.Provider>
        )
    }
}

export default ProjectsProvider
