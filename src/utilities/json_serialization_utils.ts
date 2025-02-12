import PouchDB from 'pouchdb'

import {
    getInstallations,
    getProject,
    getProjectDocumentNames,
    putInstallation,
    putProject,
} from './database_utils'
import {
    type Base,
    type Installation,
    type Project,
} from '../types/database.types'

export const JSON_DOCUMENT_CONTENT_TYPE: string =
    process.env.REACT_APP_JSON_DOCUMENT_CONTENT_TYPE

export const JSON_DOCUMENT_FILE_EXTENSION: string =
    process.env.REACT_APP_JSON_DOCUMENT_FILE_EXTENSION

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
): Promise<JSONDocument> {
    // await db.info()

    const projectDoc = await getProject(db, projectId, {
        attachments: true,
        revs_info: false,
    })

    const installationDocs = await getInstallations(db, projectId, undefined, {
        attachments: true,
    })

    const data = {
        all_docs: [projectDoc, ...installationDocs],
    }

    return data
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
            const createdAt = new Date()
            const lastModifiedAt = createdAt

            const projectDocNames = await getProjectDocumentNames(db)

            const projectId = crypto.randomUUID()

            const projectResponse = await putProject(db, {
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
            })

            if (projectResponse.ok) {
                const installationResponses = await Promise.all(
                    installationDocs.map(installationDoc => {
                        const installationId = crypto.randomUUID()

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
                    }),
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
        (accumulator: MaxIndexByKey, source) => {
            const [strippedSource, sourceIndexes] = _stripSuffixes(source)

            if (!(strippedSource in accumulator)) {
                accumulator[strippedSource] = 0
            }

            accumulator[strippedSource] = Math.max(
                accumulator[strippedSource],
                ...sourceIndexes,
            )

            return accumulator
        },
        {},
    )

    const [strippedTarget, targetIndexes] = _stripSuffixes(target)

    if (strippedTarget in maxIndexByKey) {
        return `${strippedTarget} (${maxIndexByKey[strippedTarget] + 1})`
    } else {
        return strippedTarget
    }
}

const RE_SUFFIX: RegExp = new RegExp(/\s*\(\s*(\d+)\s*\)\s*$/, 'i')

function _stripSuffixes(source: string): [string, number[]] {
    const indexes = []

    let previous = undefined
    let current = source.trim()

    while (previous !== current) {
        previous = current

        const result = current.match(RE_SUFFIX)

        if (result) {
            const index = parseInt(result[1])

            indexes.push(index)

            current = current.replace(RE_SUFFIX, '')
        }
    }

    return [previous, indexes]
}
