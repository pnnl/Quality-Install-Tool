import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
PouchDB.plugin(PouchDBFind)
import PouchDBUpsert from 'pouchdb-upsert'
PouchDB.plugin(PouchDBUpsert)

import TEMPLATES from '../templates'
import {
    type Base,
    type Installation,
    type Project,
} from '../types/database.types'

//
// BASE
//

export async function setDocumentName<Model>(
    db: PouchDB.Database<Base>,
    id: PouchDB.Core.DocumentId,
    docName: string,
): Promise<PouchDB.UpsertResponse> {
    const lastModifiedAt = new Date()

    const diffFun: PouchDB.UpsertDiffCallback<Base & Model> = (
        doc: Partial<PouchDB.Core.Document<Base & Model>>,
    ) => {
        if (doc) {
            return {
                ...doc,
                metadata_: {
                    ...doc.metadata_,
                    doc_name: docName,
                    last_modified_at: lastModifiedAt,
                },
            } as Base & Model & Partial<PouchDB.Core.IdMeta>
        } else {
            return null as PouchDB.CancelUpsert
        }
    }

    const upsertResponse: PouchDB.UpsertResponse = await db.upsert<
        Base & Model
    >(id, diffFun)

    return upsertResponse
}

//
// INSTALLATIONS
//

export function newInstallation(
    docName: string,
    workflowName: keyof typeof TEMPLATES,
    id: PouchDB.Core.DocumentId | undefined = undefined,
): PouchDB.Core.PutDocument<Installation> {
    const createdAt: Date = new Date()
    const lastModifiedAt: Date = createdAt

    const templateName: keyof typeof TEMPLATES = workflowName
    const templateTitle: string = TEMPLATES[workflowName]?.title ?? ''

    const _id: PouchDB.Core.DocumentId = id ?? crypto.randomUUID()
    const _rev: PouchDB.Core.RevisionId | undefined = undefined
    const _attachments: PouchDB.Core.Attachments = {}

    const doc: PouchDB.Core.PutDocument<Installation> = {
        _id,
        _rev,
        _attachments,

        id: _id,
        type: 'installation',
        children: [],
        data_: {},
        metadata_: {
            doc_name: docName,
            template_name: String(templateName),
            template_title: templateTitle,
            created_at: createdAt,
            last_modified_at: lastModifiedAt,
            attachments: {},
            status: 'new',
        },
    }

    return doc
}

export async function getInstallation(
    db: PouchDB.Database<Base>,
    id: PouchDB.Core.DocumentId,
    options: PouchDB.Core.GetOptions = {},
): Promise<PouchDB.Core.Document<Installation> & PouchDB.Core.GetMeta> {
    await db.info()

    const doc: PouchDB.Core.Document<Installation> & PouchDB.Core.GetMeta =
        await db.get<Installation>(id, options)

    return doc
}

export async function getInstallationIds(
    db: PouchDB.Database<Base>,
    projectId: PouchDB.Core.DocumentId,
    workflowName: keyof typeof TEMPLATES | undefined = undefined,
): Promise<Array<PouchDB.Core.DocumentId>> {
    // await db.info()

    const doc: PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta =
        await getProject(db, projectId, {})

    if (workflowName) {
        const findRequest: PouchDB.Find.FindRequest<Base> = {
            selector: {
                _id: {
                    $in: doc.children,
                },
                type: {
                    $eq: 'installation',
                },
                metadata_: {
                    template_name: {
                        $eq: String(workflowName),
                    },
                },
            },
            fields: ['_id'],
        }

        const findResponse: PouchDB.Find.FindResponse<Base> =
            await db.find(findRequest)

        const installationIds: Array<PouchDB.Core.DocumentId> =
            findResponse.docs.map(
                (doc: PouchDB.Core.ExistingDocument<Base>) => {
                    return doc._id
                },
            )

        return installationIds
    } else {
        return doc.children
    }
}

export async function getInstallations(
    db: PouchDB.Database<Base>,
    projectId: PouchDB.Core.DocumentId,
    workflowName: keyof typeof TEMPLATES | undefined = undefined,
    options: PouchDB.Core.AllDocsOptions = {},
): Promise<
    Array<
        PouchDB.Core.ExistingDocument<Installation> & PouchDB.Core.AllDocsMeta
    >
> {
    // await db.info()

    const installationIds: Array<PouchDB.Core.DocumentId> =
        await getInstallationIds(db, projectId, workflowName)

    const allDocsWithKeysOptions: PouchDB.Core.AllDocsWithKeysOptions = {
        ...options,
        include_docs: true,
        keys: installationIds,
    }

    const allDocsWithKeysResponse: PouchDB.Core.AllDocsWithKeysResponse<Installation> =
        await db.allDocs<Installation>(allDocsWithKeysOptions)

    const installationDocs: Array<
        PouchDB.Core.ExistingDocument<Installation> & PouchDB.Core.AllDocsMeta
    > = allDocsWithKeysResponse.rows
        .filter(row => {
            return (
                !('error' in row && row.error === 'not_found') &&
                'doc' in row &&
                row.doc !== null &&
                row.doc !== undefined
            )
        })
        .map(row => {
            // @ts-ignore: TS2339
            return row.doc as PouchDB.Core.ExistingDocument<Installation> &
                PouchDB.Core.AllDocsMeta
        })

    return installationDocs
}

export async function putInstallation(
    db: PouchDB.Database<Base>,
    projectId: PouchDB.Core.DocumentId,
    doc: PouchDB.Core.PutDocument<Installation>,
    options: PouchDB.Core.PutOptions = {},
): Promise<[PouchDB.Core.Response, PouchDB.UpsertResponse | undefined]> {
    await db.info()

    const response: PouchDB.Core.Response = await db.put<Installation>(
        doc,
        options,
    )

    if (response.ok) {
        const diffFun: PouchDB.UpsertDiffCallback<Project> = (
            doc: Partial<PouchDB.Core.Document<Project>>,
        ) => {
            if (doc) {
                const children: Array<PouchDB.Core.DocumentId> =
                    doc.children ?? []

                if (children.includes(response.id)) {
                    return null as PouchDB.CancelUpsert
                } else {
                    doc.children = [...children, response.id]

                    return doc as Project & Partial<PouchDB.Core.IdMeta>
                }
            } else {
                return null as PouchDB.CancelUpsert
            }
        }

        const upsertResponse: PouchDB.UpsertResponse = await db.upsert<Project>(
            projectId,
            diffFun,
        )

        return [response, upsertResponse]
    }

    return [response, undefined]
}

export async function putNewInstallation(
    db: PouchDB.Database<Base>,
    projectId: PouchDB.Core.DocumentId,
    workflowName: keyof typeof TEMPLATES,
    docName: string,
    id: PouchDB.Core.DocumentId | undefined = undefined,
    getOptions: PouchDB.Core.GetOptions = {},
    putOptions: PouchDB.Core.PutOptions = {},
): Promise<PouchDB.Core.Document<Installation> & PouchDB.Core.GetMeta> {
    // await db.info()

    if (id) {
        return await getInstallation(db, id, getOptions)
    }

    const doc: PouchDB.Core.PutDocument<Installation> = newInstallation(
        docName,
        workflowName,
        id,
    )

    const [response, upsertResponse]: [
        PouchDB.Core.Response,
        PouchDB.UpsertResponse | undefined,
    ] = await putInstallation(db, projectId, doc, putOptions)

    if (response.ok) {
        if (upsertResponse && upsertResponse.updated) {
            return await getInstallation(db, response.id, getOptions)
        } else {
            throw new Error(
                `putNewInstallation: Error upserting document with id '${projectId}'.`,
            )
        }
    } else {
        throw new Error(
            `putNewInstallation: Error inserting document with id '${response.id}'.`,
        )
    }
}

export async function removeInstallation(
    db: PouchDB.Database<Base>,
    projectId: PouchDB.Core.DocumentId,
    id: PouchDB.Core.DocumentId,
    rev: PouchDB.Core.RevisionId,
    options: PouchDB.Core.Options = {},
): Promise<[PouchDB.Core.Response | undefined, PouchDB.UpsertResponse]> {
    await db.info()

    const diffFun: PouchDB.UpsertDiffCallback<Project> = (
        doc: Partial<PouchDB.Core.Document<Project>>,
    ) => {
        const children: Array<PouchDB.Core.DocumentId> = doc.children ?? []

        if (children.includes(id)) {
            doc.children = children.filter(childId => {
                return childId !== id
            })

            return doc as Project & Partial<PouchDB.Core.IdMeta>
        } else {
            return null as PouchDB.CancelUpsert
        }
    }

    const upsertResponse: PouchDB.UpsertResponse = await db.upsert<Project>(
        projectId,
        diffFun,
    )

    if (upsertResponse.updated) {
        const response: PouchDB.Core.Response = await db.remove(
            id,
            rev,
            options,
        )

        return [response, upsertResponse]
    }

    return [undefined, upsertResponse]
}

//
// PROJECTS
//

export function newProject(
    docName: string,
    id: PouchDB.Core.DocumentId | undefined = undefined,
): PouchDB.Core.PutDocument<Project> {
    const createdAt: Date = new Date()
    const lastModifiedAt: Date = createdAt

    const _id: PouchDB.Core.DocumentId = id ?? crypto.randomUUID()
    const _rev: PouchDB.Core.RevisionId | undefined = undefined
    const _attachments: PouchDB.Core.Attachments = {}

    const doc: PouchDB.Core.PutDocument<Project> = {
        _id,
        _rev,
        _attachments,

        id: _id,
        type: 'project',
        children: [],
        data_: {},
        metadata_: {
            doc_name: docName,
            created_at: createdAt,
            last_modified_at: lastModifiedAt,
            attachments: {},
            status: 'new',
        },
    }

    return doc
}

export async function getProject(
    db: PouchDB.Database<Base>,
    id: PouchDB.Core.DocumentId,
    options: PouchDB.Core.GetOptions = {},
): Promise<PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta> {
    await db.info()

    const doc: PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta =
        await db.get<Project>(id, options)

    return doc
}

export async function getProjectDocNames(
    db: PouchDB.Database<Base>,
): Promise<Array<string>> {
    await db.info()

    const findRequest: PouchDB.Find.FindRequest<Base> = {
        selector: {
            type: {
                $eq: 'project',
            },
            metadata_: {
                doc_name: {
                    $ne: '',
                },
            },
        },
        fields: ['metadata_.doc_name'],
    }

    const findResponse: PouchDB.Find.FindResponse<Base> =
        await db.find(findRequest)

    const projectDocNames: Array<string> = findResponse.docs.map(
        (doc: PouchDB.Core.ExistingDocument<Base>) => {
            return doc.metadata_.doc_name
        },
    )

    return projectDocNames
}

export async function getProjects(
    db: PouchDB.Database<Base>,
    options: PouchDB.Core.AllDocsOptions = {},
): Promise<
    Array<PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta>
> {
    await db.info()

    const findRequest: PouchDB.Find.FindRequest<Base> = {
        selector: {
            type: {
                $eq: 'project',
            },
        },
        fields: ['_id'],
    }

    const findResponse: PouchDB.Find.FindResponse<Base> =
        await db.find(findRequest)

    const projectIds: Array<PouchDB.Core.DocumentId> = findResponse.docs.map(
        (doc: PouchDB.Core.ExistingDocument<Base>) => {
            return doc._id
        },
    )

    const allDocsWithKeysOptions: PouchDB.Core.AllDocsWithKeysOptions = {
        ...options,
        include_docs: true,
        keys: projectIds,
    }

    const allDocsWithKeysResponse: PouchDB.Core.AllDocsWithKeysResponse<Project> =
        await db.allDocs<Project>(allDocsWithKeysOptions)

    const projectDocs: Array<
        PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta
    > = allDocsWithKeysResponse.rows
        .filter(row => {
            return (
                !('error' in row && row.error === 'not_found') &&
                'doc' in row &&
                row.doc !== null &&
                row.doc !== undefined
            )
        })
        .map(row => {
            // @ts-ignore: TS2339
            return row.doc as PouchDB.Core.ExistingDocument<Project> &
                PouchDB.Core.AllDocsMeta
        })

    return projectDocs
}

export async function putProject(
    db: PouchDB.Database<Base>,
    doc: PouchDB.Core.PutDocument<Project>,
    options: PouchDB.Core.PutOptions = {},
): Promise<PouchDB.Core.Response> {
    await db.info()

    const response: PouchDB.Core.Response = await db.put<Project>(doc, options)

    return response
}

export async function putNewProject(
    db: PouchDB.Database<Base>,
    docName: string,
    id: PouchDB.Core.DocumentId | undefined = undefined,
    getOptions: PouchDB.Core.GetOptions = {},
    putOptions: PouchDB.Core.PutOptions = {},
): Promise<PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta> {
    // await db.info()

    if (id) {
        return await getProject(db, id, getOptions)
    }

    const doc: PouchDB.Core.PutDocument<Project> = newProject(docName, id)

    const response: PouchDB.Core.Response = await putProject(
        db,
        doc,
        putOptions,
    )

    if (response.ok) {
        return await getProject(db, response.id, getOptions)
    } else {
        throw new Error(
            `putNewProject: Error inserting document with id '${response.id}'.`,
        )
    }
}

export async function removeEmptyProjects(
    db: PouchDB.Database<Base>,
    options: PouchDB.Core.Options = {},
): Promise<Array<PouchDB.Core.Response | PouchDB.Core.Error>> {
    await db.info()

    const findRequest: PouchDB.Find.FindRequest<Base> = {
        selector: {
            type: {
                $eq: 'project',
            },
            metadata_: {
                doc_name: {
                    $eq: '',
                },
                status: {
                    $eq: 'new',
                },
            },
        },
        fields: ['_id', '_rev'],
    }

    const findResponse: PouchDB.Find.FindResponse<Base> =
        await db.find(findRequest)

    const projectPutDocs: Array<PouchDB.Core.PutDocument<Project>> =
        findResponse.docs.map((doc: PouchDB.Core.ExistingDocument<Base>) => {
            return {
                _deleted: true,
                _id: doc._id,
                _rev: doc._rev,
            } as PouchDB.Core.PutDocument<Project>
        })

    const bulkDocsOptions: PouchDB.Core.BulkDocsOptions = {
        ...options,
    }

    const projectResponses: Array<PouchDB.Core.Response | PouchDB.Core.Error> =
        await db.bulkDocs<Project>(projectPutDocs, bulkDocsOptions)

    return projectResponses
}

export async function removeProject(
    db: PouchDB.Database<Base>,
    id: PouchDB.Core.DocumentId,
    options: PouchDB.Core.Options = {},
): Promise<
    [PouchDB.Core.Response, Array<PouchDB.Core.Response | PouchDB.Core.Error>]
> {
    // await db.info()

    const projectDoc: PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta =
        await getProject(db, id)

    const projectRemoveDoc: PouchDB.Core.RemoveDocument = {
        _id: projectDoc._id,
        _rev: projectDoc._rev,
    }

    const installationIds: Array<PouchDB.Core.DocumentId> =
        await getInstallationIds(db, id, undefined)

    if (installationIds.length > 0) {
        const allDocsWithKeysOptions: PouchDB.Core.AllDocsWithKeysOptions = {
            keys: installationIds,
        }

        const allDocsWithKeysResponse: PouchDB.Core.AllDocsWithKeysResponse<Installation> =
            await db.allDocs<Installation>(allDocsWithKeysOptions)

        const installationPutDocs: Array<
            PouchDB.Core.PutDocument<Installation>
        > = allDocsWithKeysResponse.rows
            .filter(row => {
                return (
                    !('error' in row && row.error === 'not_found') &&
                    'doc' in row &&
                    row.doc !== null &&
                    row.doc !== undefined
                )
            })
            .map(row => {
                const doc =
                    // @ts-ignore: TS2339
                    row.doc as PouchDB.Core.ExistingDocument<Installation> &
                        PouchDB.Core.AllDocsMeta

                return {
                    _deleted: true,
                    _id: doc._id,
                    _rev: doc._rev,
                } as PouchDB.Core.PutDocument<Installation>
            })

        if (installationPutDocs.length > 0) {
            const installationBulkDocsOptions: PouchDB.Core.BulkDocsOptions = {
                ...options,
            }

            const installationResponses: Array<
                PouchDB.Core.Response | PouchDB.Core.Error
            > = await db.bulkDocs<Installation>(installationPutDocs, options)

            const response: PouchDB.Core.Response = await db.remove(
                projectRemoveDoc,
                options,
            )

            return [response, installationResponses]
        } else {
            const response: PouchDB.Core.Response = await db.remove(
                projectRemoveDoc,
                options,
            )

            return [response, []]
        }
    } else {
        const response: PouchDB.Core.Response = await db.remove(
            projectRemoveDoc,
            options,
        )

        return [response, []]
    }
}
