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
import { getInstallation } from '../utilities/database_utils'

export type InstallationDocument = PouchDB.Core.Document<Installation> &
    PouchDB.Core.GetMeta

export const InstallationContext = createContext<
    [
        InstallationDocument | undefined,
        React.Dispatch<React.SetStateAction<InstallationDocument | undefined>>,
        () => Promise<void>,
    ]
>([undefined, () => {}, async () => {}])

export function useInstallation(): [
    InstallationDocument | undefined,
    React.Dispatch<React.SetStateAction<InstallationDocument | undefined>>,
    () => Promise<void>,
] {
    return useContext(InstallationContext)
}

interface InstallationProviderProps {
    installationId: PouchDB.Core.DocumentId | undefined
    attachments?: boolean | undefined
    children: React.ReactNode
}

const InstallationProvider: React.FC<InstallationProviderProps> = ({
    installationId,
    attachments,
    children,
}) => {
    const db = useDatabase()

    const [error, setError] = useState<PouchDB.Core.Error | undefined>(
        undefined,
    )

    const [installation, setInstallation] = useState<
        InstallationDocument | undefined
    >(undefined)

    const reloadInstallation = useCallback(async () => {
        if (installationId) {
            try {
                const installation = await getInstallation(db, installationId, {
                    attachments,
                    binary: attachments ? true : undefined,
                })

                setError(undefined)

                setInstallation(installation)
            } catch (cause) {
                setError(cause as PouchDB.Core.Error)

                setInstallation(undefined)
            }
        } else {
            setError({})

            setInstallation(undefined)
        }
    }, [attachments, db, installationId])

    useEffect(() => {
        reloadInstallation()
    }, [reloadInstallation])

    useEffect(() => {
        const changes = db
            .changes<Installation>({
                live: true,
                since: 'now',
                include_docs: true,
                attachments,
                binary: attachments ? true : undefined,
                doc_ids: installationId ? [installationId] : undefined,
            })
            .on('change', value => {
                if (value.deleted) {
                    setError({
                        id: value.id,
                        status: 404,
                    })

                    setInstallation(undefined)
                } else if (value.doc?._id === installationId) {
                    setError(undefined)

                    setInstallation(value.doc)
                }
            })

        return () => {
            changes.cancel()
        }
    }, [attachments, db, installationId])

    if (error) {
        return (
            <div className="container">
                <p>Installation not found.</p>
            </div>
        )
    } else {
        return (
            <InstallationContext.Provider
                value={[installation, setInstallation, reloadInstallation]}
            >
                {children}
            </InstallationContext.Provider>
        )
    }
}

export default InstallationProvider
