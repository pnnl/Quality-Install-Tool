import PouchDB from 'pouchdb'

import {
    getInstallations,
    getProject,
    getProjectDocNames,
    putInstallation,
    putProject,
} from './database_utils'
import {
    type Base,
    type Installation,
    type Project,
} from '../types/database.types'

export const JSON_DOCUMENT_CONTENT_TYPE: string = 'application/json'

export const JSON_DOCUMENT_FILE_EXTENSION: string = '.qit.json'

export type JSONDocument = {
    all_docs: JSONDocumentObject | Array<JSONDocumentObject>
}

export type JSONDocumentObject = (Project | Installation) &
    Partial<AttachmentsMeta> &
    Partial<PouchDB.Core.IdMeta> &
    Partial<PouchDB.Core.RevisionIdMeta>

export interface AttachmentsMeta {
    _attachments: PouchDB.Core.Attachments | undefined
}

export async function exportJSONDocument(
    db: PouchDB.Database<Base>,
    projectId: PouchDB.Core.DocumentId,
    includeInstallations: boolean = true,
): Promise<JSONDocument> {
    // await db.info()

    const projectDoc: PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta =
        await getProject(db, projectId, {
            attachments: true,
            revs_info: false,
        })

    if (includeInstallations) {
        const installationDocs: Array<
            PouchDB.Core.ExistingDocument<Installation> &
                PouchDB.Core.AllDocsMeta
        > = await getInstallations(db, projectId, undefined, {
            attachments: true,
        })

        const data: JSONDocument = {
            all_docs: [projectDoc, ...installationDocs],
        }

        return data
    } else {
        const data: JSONDocument = {
            all_docs: projectDoc,
        }

        return data
    }
}

export async function importJSONDocument(
    db: PouchDB.Database<Base>,
    data: JSONDocument,
): Promise<
    [
        PouchDB.Core.Response,
        (
            | Array<[PouchDB.Core.Response, PouchDB.UpsertResponse | undefined]>
            | undefined
        ),
    ]
> {
    // await db.info()

    const projectDocs: Array<PouchDB.Core.PutDocument<Project>> = []
    const installationDocs: Array<PouchDB.Core.PutDocument<Installation>> = []

    const values: Array<JSONDocumentObject> = Array.isArray(data.all_docs)
        ? data.all_docs
        : [data.all_docs]

    values.forEach(value => {
        switch (value.type) {
            case 'project':
                projectDocs.push(value as PouchDB.Core.PutDocument<Project>)

                break
            case 'installation':
                installationDocs.push(
                    value as PouchDB.Core.PutDocument<Installation>,
                )

                break
        }
    })

    switch (projectDocs.length) {
        case 0:
            throw new Error(`importJSONDocument: No projects found.`)
        case 1:
            const createdAt: Date = new Date()
            const lastModifiedAt: Date = createdAt

            const projectDocNames = await getProjectDocNames(db)

            const projectId: PouchDB.Core.DocumentId = crypto.randomUUID()

            const projectResponse: PouchDB.Core.Response = await putProject(
                db,
                {
                    ...projectDocs[0],
                    _id: projectId,
                    _rev: undefined,
                    children: [],
                    metadata_: {
                        ...projectDocs[0].metadata_,
                        doc_name: _appendSuffix(
                            projectDocNames,
                            projectDocs[0].metadata_.doc_name,
                        ),
                        created_at: createdAt,
                        last_modified_at: lastModifiedAt,
                    },
                },
            )

            if (projectResponse.ok) {
                const installationResponses: Array<
                    [PouchDB.Core.Response, PouchDB.UpsertResponse | undefined]
                > = await Promise.all(
                    installationDocs.map(
                        (
                            installationDoc: PouchDB.Core.PutDocument<Installation>,
                        ) => {
                            const installationId: PouchDB.Core.DocumentId =
                                crypto.randomUUID()

                            return putInstallation(db, projectId, {
                                ...installationDoc,
                                _id: installationId,
                                _rev: undefined,
                                children: [],
                                metadata_: {
                                    ...installationDoc.metadata_,
                                    created_at: createdAt,
                                    last_modified_at: lastModifiedAt,
                                },
                            })
                        },
                    ),
                )

                return [projectResponse, installationResponses]
            } else {
                return [projectResponse, undefined]
            }
        default:
            throw new Error('importJSONDocument: More than one project found.')
    }
}

function _appendSuffix(sources: string[], target: string) {
    type MaxIndexByKey = {
        [key: string]: number
    }

    const maxIndexByKey: MaxIndexByKey = sources.reduce(
        (accumulator: MaxIndexByKey, source: string) => {
            const [strippedSource, sourceIndexes]: [string, number[]] =
                _stripSuffixes(source)

            if (!(strippedSource in accumulator)) {
                accumulator[strippedSource] = 0
            }

            accumulator[strippedSource] = Math.max(
                accumulator[strippedSource],
                ...sourceIndexes,
            )

            return accumulator
        },
        {} as MaxIndexByKey,
    )

    const [strippedTarget, targetIndexes]: [string, number[]] =
        _stripSuffixes(target)

    if (strippedTarget in maxIndexByKey) {
        return `${strippedTarget} (${maxIndexByKey[strippedTarget] + 1})`
    } else {
        return strippedTarget
    }
}

const RE_SUFFIX: RegExp = new RegExp(/\s*\(\s*(\d+)\s*\)\s*$/, 'i')

function _stripSuffixes(source: string): [string, number[]] {
    const indexes: number[] = []

    let previous: string | undefined = undefined
    let current: string = source.trim()

    while (previous !== current) {
        previous = current

        const result: string[] | null = current.match(RE_SUFFIX)

        if (result) {
            const index: number = parseInt(result[1])

            indexes.push(index)

            current = current.replace(RE_SUFFIX, '')
        }
    }

    return [previous, indexes]
}
