import templatesConfig from '../templates/templates_config'

/**
 * Represents a document structure in a database with metadata and workflow information.
 */
interface DBDocType {
    id: string
    type: string
    data_: {}
    metadata_: {
        doc_name: string
        created_at: Date
        last_modified_at: Date
        attachments: {}
        template_title?: string
        template_name?: string
    }
    children: []
}

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
    let workflow_title = dbInfo.db_name

    // Get the corresponding workflow title from templates_config
    if (workflow_name.indexOf('quality_install_tool') > 0) {
        const template_name = workflow_name
            .split('_')
            .slice(1, workflow_name.length)
            .join('_')
        workflow_title = templatesConfig[template_name].title
    }
    // Store the new document if it does not exist
    return db.putIfNotExists({
        _id: docName,
        data_: {},
        metadata_: {
            created_at: now,
            last_modified_at: now,
            attachments: {},
            project_name: docName,
        },
    })
}

export async function putNewProject(
    db: PouchDB.Database<{}>,
    docName: string,
    docId: string,
    type: string,
): Promise<any> {
    // Get the current date
    const now = new Date()
    // TODO: Handle the error case better
    const dbInfo = await promisifiedDBInfo(db)
    if (!dbInfo) {
        throw new Error('Database info should never be null')
    }

    // Store the new document if it does not exist
    return db.putIfNotExists({
        _id: docId ? docId : crypto.randomUUID(),
        type: type,
        data_: {},
        metadata_: {
            doc_name: docName,
            created_at: now,
            last_modified_at: now,
            attachments: {},
            status: 'new',
        },

        children: [],
    })
}

/**
 * Adds a new project document to the PouchDB database with the provided name and date.
 * @param {PouchDB.Database<{}>} db - The PouchDB database instance.
 * @param {string} docName - The name of the document to be added.
 * @param {docId} docId - The _id of the document, if already exists
 * @returns A Promise that resolves to the new document if one was added.
 */
export async function putNewProject(
    db: PouchDB.Database<{}>,
    docName: string,
    docId: string,
): Promise<DBDocType> {
    // Store the new document if it does not exist
    return putNewDoc(db, docName, docId, 'project')
}

/**
 * Adds a new job or installation document in PouchDB
 * @param db - The PouchDB database instance.
 * @param docId - The _id of the document if already exist in the db
 * @param workflowName  - Installation type
 * @param docName  - Name provided by the user for the job or installation
 * @param parentId  - The _id of the parent or project document that the job is linked.
 * @returns A Promise that resolves to the document if one was added / updated
 */
export async function putNewInstallation(
    db: PouchDB.Database<{}>,
    docId: string,
    workflowName: string,
    docName: string,
    parentId: string,
): Promise<PouchDB.UpsertResponse> {
    // Get the current date
    const now = new Date()
    // TODO: Handle the error case better
    const dbInfo = await promisifiedDBInfo(db)
    if (!dbInfo) {
        throw new Error('Database info should never be null')
    }
    const installation_doc = putNewDoc(db, docName, docId, 'installation')

    // append the installation.id in the project doc
    appendChildToProject(db, parentId, (await installation_doc).id)

    const template_name = workflowName
    let template_title = templatesConfig[workflowName].title

    // update installation doc to include template_name and template_title
    return db.upsert((await installation_doc).id, function (doc: any) {
        doc.metadata_.template_title = template_title
        doc.metadata_.template_name = template_name
        return doc
    })
}

/**
 * Retrieves the document for give docId from the database
 * @param db - The PouchDB database instance.
 * @param docId - The docID to retrieve the doc
 * @returns - Promise that resolves doc from the database
 */
export async function retrieveDocFromDB(
    db: PouchDB.Database<{}>,
    docId: string,
): Promise<any> {
    try {
        const result = await db.get(docId)
        return result
    } catch (error) {
        console.error('Error retrieving jobs:', error)
    }
}

/**
 * Retrieves all the project docs from the database
 * @param db  - The PouchDB database instance.
 * @returns Promise that resolves list of projects from the database
 */
export async function retrieveProjectDocs(
    db: PouchDB.Database<{}>,
): Promise<any> {
    try {
        const allDocs = await db.allDocs({ include_docs: true })

        const projects = allDocs.rows
            .map(row => row.doc as any)
            .filter(doc => doc.type === 'project')

        return projects
    } catch (error) {
        console.error('Error retrieving projects:', error)
    }
}

/**
 * Retrieves the Job / Installation list from the database specific to workflow
 * @param db -The PouchDB database instance.
 * @param docId - The project docID
 * @param workflowName - The Workflow name to retrieve list of jobs under the same workflow
 * @returns  -  returns list of jobs/installation details under the same workflow
 */

export async function retrieveInstallationDocs(
    db: PouchDB.Database<{}>,
    parentId: string,
    workflowName: string,
): Promise<any> {
    try {
        const allDocs = await db.allDocs({ include_docs: true })
        const installation_ids = allDocs.rows
            .map(row => row.doc as any)
            .filter(doc => doc.type === 'project' && doc._id === parentId)
            .flatMap(doc => doc.children || [])

        const jobs = allDocs.rows
            .map(row => row.doc as any)
            .filter(
                doc =>
                    doc.type === 'installation' &&
                    installation_ids.includes(doc._id) &&
                    doc.metadata_.template_name === workflowName,
            )
        return jobs
    } catch (error) {
        console.error('Error retrieving jobs:', error)
    }
}

/**
 * Retrieves the project summary information which includes project name and installation address
 * @param db -The PouchDB database instance.
 * @param docId - The project docID
 * @param workflowName - The Workflow name
 * @returns Project summary to be displayed in each page.
 */
export async function retrieveProjectSummary(
    db: PouchDB.Database<{}>,
    docId: string,
    workflowName: string,
): Promise<any> {
    try {
        const doc: any = await db.get(docId)

        if (doc) {
            const project_name = doc.metadata_?.doc_name
            const installation_name =
                workflowName != '' ? templatesConfig[workflowName].title : ''
            const street_address = doc.data_.location?.street_address
                ? doc.data_.location?.street_address + ', '
                : null
            const city = doc.data_.location?.city
                ? doc.data_.location?.city + ', '
                : null
            const state = doc.data_.location?.state
                ? doc.data_.location?.state + ' '
                : null
            const zip_code = doc.data_.location?.zip_code
                ? doc.data_.location?.zip_code
                : null
            const project_details = {
                project_name: project_name,
                installation_name: installation_name,
                street_address: street_address,
                city: city,
                state: state,
                zip_code: zip_code,
            }
            return project_details
        }
    } catch (error) {
        console.error('Error retrieving project information:', error)
    }
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

/**
 *
 */
export async function appendChildToProject(
    db: PouchDB.Database<{}>,
    docId: string,
    childDocId: string,
): Promise<unknown> {
    try {
        // Fetch the document, update the children array, and put it back in one go
        return await db.upsert<any>(docId, doc => {
            doc.children = doc.children || [] // Ensure the children array exists
            if (!doc.children.includes(childDocId)) {
                // Check if childDocId is not already in the array
                doc.children.push(childDocId) // Append the new child
            }
            return doc // Return the modified document
        })
    } catch (err) {
        console.error('Error appending child to project:', err)
        throw err
    }
}
