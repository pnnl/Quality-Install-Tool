import PouchDB from 'pouchdb'
import React, { ReactNode, createContext, useContext } from 'react'

import { type Base } from '../types/database.types'

const db = new PouchDB<Base>('quality-install-tool', { auto_compaction: true })

const DatabaseContext = createContext<PouchDB.Database<Base>>(db)

interface DatabaseProviderProps {
    children: ReactNode
}

const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
    return (
        <DatabaseContext.Provider value={db}>
            {children}
        </DatabaseContext.Provider>
    )
}

export function useDatabase(): PouchDB.Database<Base> {
    return useContext(DatabaseContext)
}

export default DatabaseProvider
