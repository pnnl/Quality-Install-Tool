import type PouchDB from 'pouchdb'
import { type Base } from '../types/database.types'

/**
 * Writes a document to PouchDB with automatic conflict resolution.
 *
 * When a 409 Conflict error occurs (document revision mismatch), automatically
 * fetches the latest document revision and retries with exponential backoff.
 * This prevents data loss during rapid concurrent updates.
 *
 * @param db - PouchDB database instance
 * @param doc - Document to write (may have stale _rev)
 * @param maxRetries - Maximum retry attempts (default: 3)
 * @returns Successful write response
 * @throws Error if max retries exceeded or non-conflict error occurs
 */
export async function putWithConflictRetry<T extends Base>(
    db: PouchDB.Database<Base>,
    doc: PouchDB.Core.PutDocument<T>,
    maxRetries = 3,
): Promise<PouchDB.Core.Response> {
    let lastError: PouchDB.Core.Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await db.put<T>(doc)
        } catch (error) {
            const dbError = error as PouchDB.Core.Error
            lastError = dbError

            if (dbError.status === 409 && attempt < maxRetries) {
                const latestDoc = await db.get<T>(doc._id as string)
                doc._rev = (
                    latestDoc as PouchDB.Core.Document<T> & PouchDB.Core.GetMeta
                )._rev
                await new Promise(r =>
                    setTimeout(r, Math.pow(2, attempt) * 100),
                )
            } else {
                throw error
            }
        }
    }

    throw lastError
}
