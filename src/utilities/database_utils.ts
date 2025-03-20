import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
PouchDB.plugin(PouchDBFind)
import PouchDBUpsert from 'pouchdb-upsert'
PouchDB.plugin(PouchDBUpsert)
import {
    type Base,
    type Installation,
    type Project,
    type ProjectData,
    type ProjectMetadata,
} from '../types/database.types'

//
// BASE
//

export async function setDocumentName<Model extends Base>(
    db: PouchDB.Database<Base>,
    id: PouchDB.Core.DocumentId,
    docName: string,
): Promise<PouchDB.UpsertResponse> {
    const lastModifiedAt = new Date()

    const diffFun: PouchDB.UpsertDiffCallback<Model> = (
        doc: Partial<PouchDB.Core.Document<Model>>,
    ) => {
        if (doc) {
            return {
                ...doc,
                metadata_: {
                    ...doc.metadata_,
                    doc_name: docName,
                    last_modified_at: lastModifiedAt.toISOString(),
                },
            } as Model & Partial<PouchDB.Core.IdMeta>
        } else {
            return null as PouchDB.CancelUpsert
        }
    }

    const upsertResponse: PouchDB.UpsertResponse = await db.upsert<Model>(
        id,
        diffFun,
    )

    return upsertResponse
}

//
// INSTALLATIONS
//

export function newInstallation(
    docName: string,
    templateName: string,
    templateTitle: string,
    id: PouchDB.Core.DocumentId | undefined = undefined,
): PouchDB.Core.PutDocument<Installation> {
    const createdAt: Date = new Date()
    const lastModifiedAt: Date = createdAt

    const _id: PouchDB.Core.DocumentId = id ?? crypto.randomUUID()
    const _rev: PouchDB.Core.RevisionId | undefined = undefined
    const _attachments: PouchDB.Core.Attachments = {}

    const doc: PouchDB.Core.PutDocument<Installation> = {
        _id,
        _rev,
        _attachments,

        type: 'installation',
        children: [],
        data_: {},
        metadata_: {
            doc_name: docName,
            template_name: templateName,
            template_title: templateTitle,
            created_at: createdAt.toISOString(),
            last_modified_at: lastModifiedAt.toISOString(),
            attachments: {},
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
    workflowName: string[] | string | undefined = undefined,
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
                        [Array.isArray(workflowName) ? '$in' : '$eq']:
                            workflowName,
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
    workflowName: string[] | string | undefined = undefined,
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
    > = []

    allDocsWithKeysResponse.rows.forEach(row => {
        if ('doc' in row && row.doc) {
            installationDocs.push(
                row.doc as PouchDB.Core.ExistingDocument<Installation> &
                    PouchDB.Core.AllDocsMeta,
            )
        }
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
    data: Partial<ProjectData> = {},
    metadata: Partial<ProjectMetadata> = {},
): PouchDB.Core.PutDocument<Project> {
    const createdAt: Date = metadata.created_at
        ? new Date(metadata.created_at)
        : new Date()
    const lastModifiedAt: Date = metadata.last_modified_at
        ? new Date(metadata.last_modified_at)
        : createdAt

    const _id: PouchDB.Core.DocumentId = id ?? crypto.randomUUID()
    const _rev: PouchDB.Core.RevisionId | undefined = undefined
    const _attachments: PouchDB.Core.Attachments = {}

    const doc: PouchDB.Core.PutDocument<Project> = {
        _id,
        _rev,
        _attachments,

        type: 'project',
        children: [],
        data_: {
            ...data,
        },
        metadata_: {
            doc_name: docName,
            created_at: createdAt.toISOString(),
            last_modified_at: lastModifiedAt.toISOString(),
            attachments: metadata.attachments ?? {},
            errors: metadata.errors ?? {
                data_: {},
                metadata_: {
                    doc_name: [''],
                },
            },
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

export async function getProjectDocumentNames(
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
    > = []

    allDocsWithKeysResponse.rows.forEach(row => {
        if ('doc' in row && row.doc) {
            projectDocs.push(
                row.doc as PouchDB.Core.ExistingDocument<Project> &
                    PouchDB.Core.AllDocsMeta,
            )
        }
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
        > = []

        allDocsWithKeysResponse.rows.forEach(row => {
            if ('doc' in row && row.doc) {
                installationPutDocs.push({
                    _deleted: true,
                    _id: row.doc._id,
                    _rev: row.doc._rev,
                } as PouchDB.Core.PutDocument<Installation>)
            }
        })

        if (installationPutDocs.length > 0) {
            const installationBulkDocsOptions: PouchDB.Core.BulkDocsOptions = {
                ...options,
            }

            const installationResponses: Array<
                PouchDB.Core.Response | PouchDB.Core.Error
            > = await db.bulkDocs<Installation>(
                installationPutDocs,
                installationBulkDocsOptions,
            )

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
