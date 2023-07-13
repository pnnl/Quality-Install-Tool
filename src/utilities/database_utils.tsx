/**
 * Adds a new document to the PouchDB database with the provided name and date.
 * @param {PouchDB.Database<{}>} db - The PouchDB database instance.
 * @param {string} name - The name of the document to be added.
 * @param {Date} date - The date of creation for the document.
 * @returns {Promise<void>} - A Promise that resolves when the document is successfully added.
 */

export async function putNewDoc(db : PouchDB.Database<{}>, name:string, date:Date) {
    db.putIfNotExists(name, {metadata_:{created_at: date, last_modified_at: date, attachments: {}}})
}