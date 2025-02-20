import PouchDB from 'pouchdb'

import migrate_0_doe_combustion_appliance_safety_tests from './0_doe_combustion_appliance_safety_tests'
import { type Base } from '../types/database.types'

type Migration = (db: PouchDB.Database<Base>) => Promise<void>

type MigrationName = string

interface MigrationRecord {
    migration_name: MigrationName
    migrated_at: Date
}

const dbMigrations = new PouchDB<MigrationRecord>(
    process.env.REACT_APP_POUCHDB_MIGRATIONS_DATABASE_NAME,
    {
        auto_compaction: true,
    },
)

const migrations: Record<MigrationName, Migration> = {
    '0_doe_combustion_appliance_safety_tests':
        migrate_0_doe_combustion_appliance_safety_tests,
}

export async function migrate(db: PouchDB.Database<Base>): Promise<void> {
    Object.entries(migrations).forEach(async ([migrationName, migration]) => {
        const findResponse = await dbMigrations.find({
            selector: {
                migration_name: {
                    $eq: migrationName,
                },
            },
            fields: ['migration_name'],
        })

        if (findResponse.docs.length === 0) {
            await migration(db)

            await dbMigrations.post<MigrationRecord>({
                migration_name: migrationName,
                migrated_at: new Date(),
            })
        }
    })
}

export default migrate
