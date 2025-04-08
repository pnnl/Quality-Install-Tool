import PouchDB from 'pouchdb'

import migrate_0_doe_combustion_appliance_safety_tests from './0_doe_combustion_appliance_safety_tests'
import migrate_1_photo_attachment_id_suffixes from './1_photo_attachment_id_suffixes'
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
    '1_photo_attachment_id_suffixes': migrate_1_photo_attachment_id_suffixes,
}

export async function migrate(db: PouchDB.Database<Base>): Promise<void> {
    await dbMigrations.info()

    const allDocsResponse = await dbMigrations.allDocs<MigrationRecord>({
        include_docs: true,
    })

    const migrationNames = allDocsResponse.rows
        .map(row => {
            return row.doc?.migration_name
        })
        .filter(migrationName => {
            return migrationName
        })

    Object.entries(migrations).forEach(async ([migrationName, migration]) => {
        if (!migrationNames.includes(migrationName)) {
            await migration(db)

            await dbMigrations.post<MigrationRecord>({
                migration_name: migrationName,
                migrated_at: new Date(),
            })
        }
    })
}

export default migrate
