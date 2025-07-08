import { isEqual, isObject, transform } from 'lodash'
import PouchDB from 'pouchdb'

import { type Base } from '../types/database.types'

function _difference(
    source: Record<string, unknown>,
    target: Record<string, unknown>,
): Record<string, unknown> {
    return transform(
        source,
        function (
            result: Record<string, unknown>,
            value: unknown,
            key: string,
        ): void {
            if (!isEqual(value, target[key])) {
                result[key] =
                    isObject(value) && isObject(target[key])
                        ? _difference(
                              value as Record<string, unknown>,
                              target[key] as Record<string, unknown>,
                          )
                        : value
            }
        },
    )
}

function _stripUndiffables(
    doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
): Record<string, unknown> {
    return {
        ...doc,
        _attachments: Object.entries(doc._attachments ?? {}).reduce(
            (accumulator, [attachmentId, attachment]) => {
                accumulator[attachmentId] = {
                    ...attachment,
                    data: undefined,
                }

                return accumulator
            },
            {} as Record<PouchDB.Core.AttachmentId, Record<string, unknown>>,
        ),
        metadata_: {
            ...doc.metadata_,
            attachments: Object.entries(doc.metadata_.attachments).reduce(
                (accumulator, [attachmentId, attachmentMetadata]) => {
                    accumulator[attachmentId] = {
                        ...attachmentMetadata,
                        timestamp: undefined,
                    }

                    return accumulator
                },
                {} as Record<
                    PouchDB.Core.AttachmentId,
                    Record<string, unknown>
                >,
            ),
            created_at: undefined,
            last_modified_at: undefined,
            errors: undefined,
        },
    }
}

export function differenceBase(
    source: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
    target: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
): Partial<PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta> {
    return _difference(_stripUndiffables(source), _stripUndiffables(target))
}

export function isEqualBase(
    source: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
    target: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
): boolean {
    return isEqual(_stripUndiffables(source), _stripUndiffables(target))
}
