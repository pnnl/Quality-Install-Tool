import PouchDB from 'pouchdb'
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

import { useDatabase } from './database_provider'
import TEMPLATES from '../templates'
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
>([[], () => {}, async () => {}])

export function useInstallations(): [
    Array<InstallationDocument>,
    React.Dispatch<React.SetStateAction<Array<InstallationDocument>>>,
    () => Promise<void>,
] {
    return useContext(InstallationsContext)
}

interface InstallationsProviderProps {
    projectId: PouchDB.Core.DocumentId | undefined
    workflowName?: keyof typeof TEMPLATES
    installationComparator?: Comparator<InstallationDocument>
    children: React.ReactNode
}

const InstallationsProvider: React.FC<InstallationsProviderProps> = ({
    projectId,
    workflowName,
    installationComparator,
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
    }, [installationComparator, projectId, workflowName])

    useEffect(() => {
        reloadInstallations()
    }, [reloadInstallations])

    if (error) {
        return <p>Installations not found.</p>
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
