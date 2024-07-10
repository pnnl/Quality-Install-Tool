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
): Promise<unknown> {
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
        data_: {},
        metadata_: {
            project_name: docName,
            created_at: now,
            last_modified_at: now,
            attachments: {},
        },
        installations_: [],
    })
}

/**
 * Adds a new Installation to the existing project document
 * @param db - The PouchDB database instance.
 * @param docId - The project docID that needs to be updated (UUID)
 * @param workflowName  - Installation type
 * @param jobId  - The unique installation id or Job ID (UUID)
 * @param docName  - Name provided by the user for the Job or Installation
 * @returns A Promise that resolves to the document if one was added / updated
 */
export async function putNewWorkFlow(
    db: PouchDB.Database<{}>,
    docId: string,
    workflowName: string,
    jobId?: string,
    docName?: string,
): Promise<unknown> {
    // Get the current date
    const now = new Date()
    // TODO: Handle the error case better
    const dbInfo = await promisifiedDBInfo(db)
    if (!dbInfo) {
        throw new Error('Database info should never be null')
    }

    const projectDoc = await db.get(docId)

    const doc_name = docName
    const workflow_name = workflowName
    let workflow_title = templatesConfig[workflowName].title

    const initializeNewWorkflow = {
        _id: crypto.randomUUID(),
        data_: {},
        metadata_: {
            workflow_title,
            workflow_name,
            doc_name,
            created_at: now,
            last_modified_at: now,
        },
    }

    const specificInstallation = projectDoc.installations_.find(
        (x: { _id: string | undefined }) => x._id === jobId,
    )

    if (!specificInstallation) {
        if (projectDoc.installations_?.length == 0) {
            projectDoc.installations_[0] = initializeNewWorkflow
        } else {
            projectDoc.installations_[projectDoc.installations_?.length] =
                initializeNewWorkflow
        }
    }
    return db.upsert(docId, function upsertFn(dbDoc: any) {
        const result = { ...dbDoc, ...projectDoc }
        if (!result.metadata_) {
            result.metadata_ = {
                created_at: new Date().toISOString(),
                last_modified_at: new Date().toISOString(),
            }
        } else {
            result.metadata_.last_modified_at = new Date().toISOString()
        }
        return result
    })
}

/**
 * Retrieves the specific project from the database
 * @param db - The PouchDB database instance.
 * @param docId - The docID to retrieve the project information
 * @returns - Promise that resolves project doc from the database
 */
export async function retrieveProjectDetails(
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
 * Retrieves all the projects from the database
 * @param db  - The PouchDB database instance.
 * @returns Promise that resolves list of projects from the database
 */
export async function retrieveProjects(db: PouchDB.Database<{}>): Promise<any> {
    try {
        const result = await db.allDocs({ include_docs: true })
        const projectList = result.rows.map(row => row.doc)
        return projectList
    } catch (error) {
        console.error('Error retrieving jobs:', error)
    }
}

/**
 * Retrieves the Job / Installation list from the database specific to workflow
 * @param db -The PouchDB database instance.
 * @param docId - The project docID
 * @param workflowName - The Workflow name to retrieve list of jobs under the same workflow
 * @returns  -  returns list of jobs/installation details under the same workflow
 */
export async function retrieveJobs_db(
    db: PouchDB.Database<{}>,
    docId: string,
    workflowName: string,
): Promise<any> {
    try {
        const projectDoc = await db.get(docId)
        let jobList: any[] = []
        projectDoc.installations_.map((key, value) => {
            if (key.metadata_.workflow_name == workflowName) {
                jobList.push(key)
            }
        })
        return jobList
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
        const doc = await db.get(docId)

        if (doc) {
            const project_name = doc.metadata_?.project_name
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
