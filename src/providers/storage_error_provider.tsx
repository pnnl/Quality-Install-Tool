import React, { createContext, useContext, useMemo, useState } from 'react'

import { getStorageErrorMessage } from '../utilities/storage_error_utils'

interface StorageErrorContextValue {
    message: string | undefined
    reportError: (error: unknown) => void
    clearError: () => void
}

const StorageErrorContext = createContext<StorageErrorContextValue>({
    message: undefined,
    reportError: () => {
        return
    },
    clearError: () => {
        return
    },
})

interface StorageErrorProviderProps {
    children: React.ReactNode
}

const StorageErrorProvider: React.FC<StorageErrorProviderProps> = ({
    children,
}) => {
    const [message, setMessage] = useState<string | undefined>(undefined)

    const value = useMemo<StorageErrorContextValue>(() => {
        return {
            message,
            reportError: (error: unknown) => {
                setMessage(getStorageErrorMessage(error))
            },
            clearError: () => {
                setMessage(undefined)
            },
        }
    }, [message])

    return (
        <StorageErrorContext.Provider value={value}>
            {children}
        </StorageErrorContext.Provider>
    )
}

export function useStorageError(): StorageErrorContextValue {
    return useContext(StorageErrorContext)
}

export default StorageErrorProvider
