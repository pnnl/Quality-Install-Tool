import PouchDB from 'pouchdb'
import React, { createContext, useContext } from 'react'

import migrate from '../migrations'
import { type Base } from '../types/database.types'

const db = new PouchDB<Base>(process.env.REACT_APP_POUCHDB_DATABASE_NAME, {
    auto_compaction: true,
})

if (process.env.JEST_WORKER_ID === undefined) {
    await migrate(db)
}

const DatabaseContext = createContext<PouchDB.Database<Base>>(db)

interface DatabaseProviderProps {
    children: React.ReactNode
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

export async function UNSAFE_close(): Promise<void> {
    await db.close()
}

export default DatabaseProvider
