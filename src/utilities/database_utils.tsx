import templatesConfig from '../templates/templates_config'

/**
 * Adds a new document to the PouchDB database with the provided name and date.
 * @param {PouchDB.Database<{}>} db - The PouchDB database instance.
 * @param {string} name - The name of the document to be added.
 * @returns A Promise that resolves to the new document if one was added.
 */
export async function putNewDoc(
    db: PouchDB.Database<{}>,
    docName: string,
): Promise<unknown> {
    // Get the current date
    const now = new Date()
    // TODO: Handle the error case better
    const dbInfo = await promisifiedDBInfo(db)
    if (!dbInfo) {
        throw new Error('Database info should never be null')
    }
    // The workflow name is the database name
    const workflow_name = dbInfo.db_name
    // Get the corresponding workflow title from templates_config
    const workflow_title = templatesConfig[workflow_name].title
    // Store the new document if it does not exist
    return db.putIfNotExists({
        _id: docName,
        data_: {},
        metadata_: {
            created_at: now,
            last_modified_at: now,
            attachments: {},
            workflow_name,
            workflow_title,
            project_name: docName,
        },
    })
}

/**
 * This converts the info method of a PouchDB database instance, that requires a callback, to a function that
 * returns a promise to the info object.
 * @param {PouchDB.Database<{}>} db - The PouchDB database instance.
 * @returns A Promise to the database's info object
 */
function promisifiedDBInfo(
    db: PouchDB.Database<{}>,
): Promise<PouchDB.Core.DatabaseInfo | null> {
    return new Promise((res, rej) =>
        db.info((err, info) => {
            if (err) {
                rej(err)
            } else {
                res(info)
            }
        }),
    )
}
