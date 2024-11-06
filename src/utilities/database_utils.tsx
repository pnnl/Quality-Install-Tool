import { useMemo } from 'react'
import templatesConfig from '../templates/templates_config'
import PouchDB from 'pouchdb'
import DBName from '../utilities/db_details'

/**
 * Custom hook to create and manage a PouchDB database instance.
 *
 * This hook initializes a PouchDB database with automatic compaction enabled.
 * The database instance is memoized to ensure that a new instance is created
 * only when the hook is used in a different component, preventing unnecessary
 * reinitialization and improving performance.
 *
 * @returns {PouchDB} The PouchDB database instance.
 *
 * @throws {Error} Throws an error if the database cannot be created or accessed.
 */
export function useDB(InputDBName?: string): any {
    const dbName = InputDBName || DBName
    const db_object = useMemo(
        () => new PouchDB(dbName, { auto_compaction: true }),
        [dbName],
    )
    return db_object
}

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
    docId: string | null,
    type: string,
): Promise<any> {
    // Get the current date
    const now = new Date()

    // Get database info
    const dbInfo = await promisifiedDBInfo(db)
    if (!dbInfo) {
        throw new Error('Database info should never be null')
    }

    if (docId) {
        try {
            // Check if the document exists
            const doc = await db.get(docId)
            return doc // Document exists, returns the doc
        } catch (err: any) {
            if (err.status !== 404) {
                // other errors
                console.error('putNewDoc: Error retrieving document:', err)
            }
        }
    }

    // Document does not exist, continue to insert it
    const newDoc = {
        _id: docId || crypto.randomUUID(),
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
    }

    try {
        return db.put(newDoc)
    } catch (err) {
        console.error('putNewDoc: Error inserting document:', err)
    }
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
) {
    // Get the current date
    const now = new Date()
    // TODO: Handle the error case better
    const dbInfo = await promisifiedDBInfo(db)
    if (!dbInfo) {
        throw new Error('Database info should never be null')
    }
    const installationDoc = await putNewDoc(db, docName, docId, 'installation')

    if (!installationDoc || !installationDoc.id) {
        const doc = await db.get(docId)
        return doc // Document exists, returns the doc
    }
    // append the installation.id in the project doc
    appendChildToProject(db, parentId, installationDoc.id)

    const template_name = workflowName
    let template_title = templatesConfig[workflowName].title

    // update installation doc to include template_name and template_title
    return db.upsert(installationDoc.id, function (doc: any) {
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
 * Exports a document from the database as a JSON object.
 * @param {any} db - The database instance from which the document will be exported.
 * @param {string} docId - The ID of the document to be exported.
 * @param {boolean} includeChild - A flag indicating whether to include child documents in the export.
 * @returns {Promise<{}>} A promise that resolves to the exported document as a JSON object.
 **/
export async function exportDocumentAsJSONObject(
    db: any,
    docId: string,
    includeChild: boolean,
): Promise<any> {
    const docById = await db.get(docId, {
        attachments: true,
        revs_info: false,
    })

    if (includeChild) {
        const childDocs: any = await db.allDocs({
            keys: docById.children,
            include_docs: true,
            attachments: true,
            revs_info: false,
        })

        const combinedDocs = [
            docById,
            ...childDocs.rows.map((row: { doc: any }) => row.doc),
        ]
        return JSON.stringify({ all_docs: combinedDocs })
    }

    return JSON.stringify({ all_docs: docById })
}

/**
 * Finds the maximum index for a given document name in an array of names.
 *
 * This function checks if any names in the provided array match the specified
 * document name or the pattern of that name followed by an index in parentheses (e.g., "docName (1)").
 * @param {string[]} names - An array of strings representing document names.
 * @param {string} docName - The base document name to search for.
 * @returns {string} The document name appended by the  maximum index of a given document name.
 */
const findMaxDocNameIndex = (names: string[], docName: string): string => {
    const baseDocName = docName.replace(/\(\d+\)$/, '') // Remove any existing index from the docName

    // Check if the docName (with or without index) already exists in the list
    const nameExists = names.some(name => name.startsWith(baseDocName))

    // If the name exists, find the next available index, otherwise return the name as is
    let count = 0
    if (nameExists) {
        count = names.reduce((maxIndex, name) => {
            // considering names that start with the same base name
            if (name.startsWith(baseDocName)) {
                // Match the index in parentheses (e.g., "Project(2)", "Project(3)")
                const match = name.match(/\((\d+)\)$/)

                // Extracting the index or default to 0 if no index is found
                const index = match && match[1] ? parseInt(match[1], 10) : 0

                // Updating the maximum index if the current index is higher
                return Math.max(maxIndex, index)
            }
            return maxIndex
        }, 0) // Starts with 0 as the default if no matches are found
    }

    return nameExists ? `${baseDocName} (${count + 1})` : docName
}

/**
 * Updates the document name for a project to avoid duplicates.
 * @param {any} input_doc - The document object that may contain a project.
 * @returns {Promise<any>} The updated document object with a unique name.
 */
const updateProjectName = async (
    input_doc: any,
    docNames: string[],
): Promise<any> => {
    // Adjust doc_name for projects to avoid duplicates
    if (input_doc.type === 'project') {
        const doc_name = input_doc.metadata_.doc_name || ''
        // add the max index for doc_name in the end of the doc name, if the name is already present
        input_doc.metadata_.doc_name = findMaxDocNameIndex(docNames, doc_name)
    }
    return input_doc
}

/**
 * Updates the project.children with installationIds from imported installations.
 * Retrieves the project document using projectId and updates its children field.
 * @param {string} projectId - The ID of the project document to be updated.
 * @param {string[]} installationIds - An array of installation IDs to be set as the project's children.
 * @returns {Promise<void>} A promise that resolves when the update operation is complete.
 */
const updateProject = async (
    db: PouchDB.Database<{}>,
    projectId: string,
    installationIds: string[],
): Promise<void> => {
    if (projectId) {
        const projectDoc: any = await db.get(projectId)
        projectDoc.children = installationIds
        try {
            await db.put(projectDoc)
        } catch (error) {
            console.log(
                'Error in updating the installations in project doc in DB',
                error,
            )
        }
    }
}

/**
 * Imports documents into the database.
 * @param db - The database instance where the documents will be imported.
 * @param jsonData - An object containing the documents along with the attachments to be imported,
 * @param docNames - An array of document names to check and update unique project name for imported project doc.
 * @returns A promise that resolves when the import is complete.
 *
 **/
export async function ImportDocumentIntoDB(
    db: PouchDB.Database<{}>,
    jsonData: { all_docs: any },
    docNames: string[],
): Promise<void> {
    let projectId: string | null = null
    let installationIds: string[] = []
    // Process each document in the JSON data
    for (const input_doc of jsonData.all_docs) {
        if (!input_doc || !input_doc.metadata_) continue

        // Clean the data for new doc creation
        // remove the id and rev from the imported doc
        delete input_doc._id
        delete input_doc._rev

        // Check if the document is a project and update its name
        // if the name is already present in the DB
        const updated_doc = await updateProjectName(input_doc, docNames)

        const now = new Date()
        updated_doc.metadata_.created_at = now
        updated_doc.metadata_.last_modified_at = now

        const result = await db.post(input_doc)
        // create a lis of the installationIds and set projectId based on document type
        if (updated_doc.type === 'installation') {
            installationIds.push(result.id)
        } else {
            projectId = result.id
        }
    }
    // Update the imported project with the newly created installation IDs
    if (projectId && installationIds)
        updateProject(db, projectId, installationIds)
}

/**
 * Appends a child document to a project document in the database.
 *
 * @param db - The PouchDB database instance where the project document resides.
 * @param docId - The ID of the project document to which the child document will be appended.
 * @param childDocId - The ID of the child document to be appended.
 * @returns {Promise<{}>} A promise that resolves to an object containing updated document.
 *
 * */
export async function appendChildToProject(
    db: PouchDB.Database<{}>,
    docId: string,
    childDocId: string,
): Promise<{}> {
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

/**
 * deleteEmptyProjects
 */
export async function deleteEmptyProjects(db: PouchDB.Database<{}>) {
    try {
        const allDocs: any = await db.allDocs({ include_docs: true })

        const projectDocs: any = allDocs.rows
            .map((row: { doc: any }) => row.doc)
            .filter(
                (doc: { metadata_: any; type: string }) =>
                    doc?.type === 'project' &&
                    doc?.metadata_?.doc_name === '' &&
                    doc?.metadata_?.status === 'new',
            )

        await Promise.all(
            projectDocs.map((doc: PouchDB.Core.RemoveDocument) =>
                db.remove(doc),
            ),
        )
        await Promise.all(
            projectDocs.map((doc: PouchDB.Core.RemoveDocument) =>
                db.remove(doc),
            ),
        )
    } catch (error) {
        //Log any errors that occur during the process
        console.error('Error in removing the project', error)
    }
}
