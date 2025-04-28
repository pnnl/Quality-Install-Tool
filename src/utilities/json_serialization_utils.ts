import PouchDB from 'pouchdb'

import {
    getInstallations,
    getProject,
    getProjectDocumentNames,
} from './database_utils'
import {
    combustionSafetyTestsWorkflowNames,
    shouldMigrateCombustionSafetyTestsProject,
    transformCombustionSafetyTestsProject,
} from '../migrations/0_doe_combustion_appliance_safety_tests'
import { transformPhotoAttachmentIdSuffixes } from '../migrations/1_photo_attachment_id_suffixes'
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
        binary: false,
        revs_info: false,
    })

    const installationDocs = await getInstallations(db, projectId, undefined, {
        attachments: true,
        binary: false,
    })

    const data = {
        all_docs: [projectDoc, ...installationDocs],
    }

    return data
}

export async function importJSONDocument(
    db: PouchDB.Database<Base>,
    data: JSONDocument,
): Promise<Array<PouchDB.Core.Response | PouchDB.Core.Error>> {
    await db.info()

    const docIds: Map<PouchDB.Core.DocumentId, PouchDB.Core.DocumentId> =
        new Map()

    let docs: Array<PouchDB.Core.PutDocument<Base>> = []

    const values: Array<JSONDocumentObject> = Array.isArray(data.all_docs)
        ? data.all_docs
        : [data.all_docs]

    values.forEach((value, index) => {
        const doc = value as PouchDB.Core.PutDocument<Base>

        if (doc._id) {
            docIds.set(doc._id, crypto.randomUUID())
        } else {
            throw new Error(
                `Document at index ${index} is missing "_id" property.`,
            )
        }

        docs.push(doc)
    })

    const createdAt = new Date()
    const lastModifiedAt = createdAt

    docs = docs.map((doc, index) => {
        if (doc.type) {
            if (['installation', 'project'].includes(doc.type)) {
                // Do nothing.
            } else {
                throw new Error(
                    `Document at index ${index} has invalid value for "type" property (expected: "installation" or "project"; received: ${JSON.stringify(doc.type)}).`,
                )
            }
        } else {
            throw new Error(
                `Document at index ${index} is missing "type" property.`,
            )
        }

        if (doc._id) {
            if (docIds.has(doc._id)) {
                const parentDocId = docIds.get(doc._id)

                if (parentDocId) {
                    return {
                        ...doc,
                        _id: parentDocId,
                        _rev: undefined,
                        children: (doc.children ?? []).map(
                            (child, childIndex) => {
                                if (typeof child === 'string') {
                                    if (docIds.has(child)) {
                                        const childDocId = docIds.get(child)

                                        if (childDocId) {
                                            return childDocId
                                        } else {
                                            throw new Error(
                                                `Child at index ${childIndex} of document at index ${index} was assigned an "_id" property, but it is falsey.`,
                                            )
                                        }
                                    } else {
                                        throw new Error(
                                            `Child at index ${childIndex} of document at index ${index} has not been assigned an "_id" property.`,
                                        )
                                    }
                                } else {
                                    throw new Error(
                                        `Child at index ${childIndex} of document at index ${index} is invalid (expected: \`string\`; received \`${typeof child}\`).`,
                                    )
                                }
                            },
                        ),
                        data_: {
                            ...doc.data_,
                            links: Object.entries(doc.data_.links ?? {}).reduce(
                                (accumulator, [link, linkDocId]) => {
                                    if (docIds.has(linkDocId)) {
                                        const newLinkDocId =
                                            docIds.get(linkDocId)

                                        if (newLinkDocId) {
                                            accumulator[link] = newLinkDocId

                                            return accumulator
                                        } else {
                                            throw new Error(
                                                `Link at key ${link} of document at index ${index} was assigned an "_id" property, but it is falsey.`,
                                            )
                                        }
                                    } else {
                                        throw new Error(
                                            `Link at key ${link} of document at index ${index} has not been assigned an "_id" property.`,
                                        )
                                    }
                                },
                                {} as Record<string, PouchDB.Core.DocumentId>,
                            ),
                        },
                        metadata_: {
                            ...doc.metadata_,
                            created_at: createdAt.toISOString(),
                            last_modified_at: lastModifiedAt.toISOString(),
                        },
                    }
                } else {
                    throw new Error(
                        `Document at index ${index} was assigned an "_id" property, but it is falsey.`,
                    )
                }
            } else {
                throw new Error(
                    `Document at index ${index} has not been assigned an "_id" property.`,
                )
            }
        } else {
            throw new Error(
                `Document at index ${index} is missing "_id" property.`,
            )
        }
    })

    const projectDocNames = await getProjectDocumentNames(db)

    const projectDocNameAppender = new Appender()

    projectDocNameAppender.put(...projectDocNames)

    docs = docs.map(doc => {
        if (doc.type === 'project') {
            const doc_name = projectDocNameAppender.get(doc.metadata_.doc_name)

            projectDocNameAppender.put(doc_name)

            return {
                ...doc,
                metadata_: {
                    ...doc.metadata_,
                    doc_name,
                },
            }
        } else {
            return doc
        }
    })

    docs.forEach((doc, index) => {
        if (doc.type === 'project') {
            const origProject = doc as PouchDB.Core.ExistingDocument<Project> &
                PouchDB.Core.AllDocsMeta

            if (shouldMigrateCombustionSafetyTestsProject(origProject)) {
                const [newProject, newInstallation] =
                    transformCombustionSafetyTestsProject(origProject)

                const children: PouchDB.Core.DocumentId[] = [
                    ...(newProject.children ?? []),
                    newInstallation._id as PouchDB.Core.DocumentId,
                ]

                docs[index] = {
                    ...newProject,
                    children,
                }

                docs.push(newInstallation)

                children.forEach(childDocId => {
                    docs.forEach((childDoc, childIndex) => {
                        if (
                            childDoc._id === childDocId &&
                            childDoc.type === 'installation'
                        ) {
                            const installation =
                                childDoc as PouchDB.Core.PutDocument<Installation>

                            if (
                                combustionSafetyTestsWorkflowNames.includes(
                                    installation.metadata_.template_name,
                                )
                            ) {
                                docs[childIndex] = {
                                    ...childDoc,
                                    data_: {
                                        ...childDoc.data_,
                                        links: {
                                            ...childDoc.data_.links,
                                            doe_combustion_appliance_safety_test_doc_id:
                                                newInstallation._id as PouchDB.Core.DocumentId,
                                        },
                                    },
                                }
                            }
                        }
                    })
                })
            }
        }
    })

    docs = docs.map(doc => {
        return transformPhotoAttachmentIdSuffixes<Base>(
            doc as PouchDB.Core.ExistingDocument<Base> &
                PouchDB.Core.AllDocsMeta,
        )
    })

    const responses = await db.bulkDocs<Base>(docs)

    return responses
}

class Appender {
    private _maxIndexByKey: {
        [key: string]: number
    } = {}

    private _reSuffix = /\s*\(\s*(\d+)\s*\)\s*$/i

    private _stripSuffixes(source: string): [string, number[]] {
        const indexes = []

        let previous = undefined
        let current = source.trim()

        while (previous !== current) {
            previous = current

            const result = current.match(this._reSuffix)

            if (result) {
                const index = parseInt(result[1])

                indexes.push(index)

                current = current.replace(this._reSuffix, '')
            }
        }

        return [previous, indexes]
    }

    // constructor() {}

    get(target: string): string {
        const [strippedTarget] = this._stripSuffixes(target)

        if (strippedTarget in this._maxIndexByKey) {
            return `${strippedTarget} (${this._maxIndexByKey[strippedTarget] + 1})`
        } else {
            return strippedTarget
        }
    }

    put(...sources: string[]): void {
        sources.forEach(source => {
            const [strippedSource, sourceIndexes] = this._stripSuffixes(source)

            if (!(strippedSource in this._maxIndexByKey)) {
                this._maxIndexByKey[strippedSource] = 0
            }

            this._maxIndexByKey[strippedSource] = Math.max(
                this._maxIndexByKey[strippedSource],
                ...sourceIndexes,
            )
        })
    }
}
