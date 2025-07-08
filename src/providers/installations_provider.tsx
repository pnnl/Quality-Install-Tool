import PouchDB from 'pouchdb'
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

import { useDatabase } from './database_provider'
import { type Installation } from '../types/database.types'
import { type Comparator } from '../utilities/comparison_utils'
import { getInstallations } from '../utilities/database_utils'

export type InstallationDocument = PouchDB.Core.ExistingDocument<Installation> &
    PouchDB.Core.AllDocsMeta

export const InstallationsContext = createContext<
    [
        Array<InstallationDocument>,
        React.Dispatch<React.SetStateAction<Array<InstallationDocument>>>,
        () => Promise<void>,
    ]
>([
    [],
    () => {
        return
    },
    async () => {
        return
    },
])

export function useInstallations(): [
    Array<InstallationDocument>,
    React.Dispatch<React.SetStateAction<Array<InstallationDocument>>>,
    () => Promise<void>,
] {
    return useContext(InstallationsContext)
}

interface InstallationsProviderProps {
    projectId: PouchDB.Core.DocumentId | undefined
    workflowName?: string
    installationComparator?: Comparator<InstallationDocument>
    attachments?: boolean | undefined
    children: React.ReactNode
}

const InstallationsProvider: React.FC<InstallationsProviderProps> = ({
    projectId,
    workflowName,
    installationComparator,
    attachments,
    children,
}) => {
    const db = useDatabase()

    const [error, setError] = useState<PouchDB.Core.Error | undefined>(
        undefined,
    )

    const [installations, setInstallations] = useState<
        Array<InstallationDocument>
    >([])

    const reloadInstallations = useCallback(async () => {
        if (projectId) {
            try {
                const installations = await getInstallations(
                    db,
                    projectId,
                    workflowName,
                    {
                        attachments,
                        binary: attachments ? true : undefined,
                    },
                )

                setError(undefined)

                if (installationComparator) {
                    setInstallations(installations.sort(installationComparator))
                } else {
                    setInstallations(installations)
                }
            } catch (cause) {
                setError(cause as PouchDB.Core.Error)

                setInstallations([])
            }
        } else {
            setError({})

            setInstallations([])
        }
    }, [attachments, db, installationComparator, projectId, workflowName])

    useEffect(() => {
        reloadInstallations()
    }, [reloadInstallations])

    if (error) {
        return (
            <div className="container">
                <p>Installations not found.</p>
            </div>
        )
    } else {
        return (
            <InstallationsContext.Provider
                value={[installations, setInstallations, reloadInstallations]}
            >
                {children}
            </InstallationsContext.Provider>
        )
    }
}

export default InstallationsProvider
