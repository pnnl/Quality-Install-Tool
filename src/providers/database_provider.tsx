import PouchDB from 'pouchdb'
import React, { createContext, useContext } from 'react'

import migrate_0_doe_combustion_appliance_safety_tests from '../migrations/0_doe_combustion_appliance_safety_tests'
import { type Base } from '../types/database.types'

const db = new PouchDB<Base>(process.env.REACT_APP_POUCHDB_DATABASE_NAME, {
    auto_compaction: true,
})

await migrate_0_doe_combustion_appliance_safety_tests(db)

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

export default DatabaseProvider
