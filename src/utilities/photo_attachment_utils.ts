import PouchDB from 'pouchdb'

import { type Base, type PhotoMetadata } from '../types/database.types'
import { escapeRegExp } from '../utilities/regexp_utils'

export interface PhotoAttachment {
    attachmentId: PouchDB.Core.AttachmentId
    attachment: PouchDB.Core.Attachment
    metadata: PhotoMetadata | undefined
}

export function getNextPhotoAttachmentId(
    attachmentId: PouchDB.Core.AttachmentId,
    photoAttachments: Array<PhotoAttachment>,
): PouchDB.Core.AttachmentId {
    const rePhotoAttachmentId = getPhotoAttachmentRegExp(attachmentId)

    return `${attachmentId}_${
        1 +
        Math.max(
            -1,
            ...photoAttachments
                .map(({ attachmentId: photoAttachmentId }) => {
                    return photoAttachmentId.match(rePhotoAttachmentId)
                })
                .filter(result => {
                    return result !== null
                })
                .map(result => {
                    return parseInt(result[2])
                })
                .filter(num => {
                    return !isNaN(num)
                }),
        )
    }`
}

export function getPhotoAttachmentRegExp(
    attachmentId: PouchDB.Core.AttachmentId,
): RegExp {
    return new RegExp(`^(${escapeRegExp(attachmentId)})_(0|[1-9][0-9]*)$`)
}

export function getPhotoAttachments(
    doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
    attachmentId: PouchDB.Core.AttachmentId,
): Array<PhotoAttachment> {
    // Match keys like photoId_1, photoId_1.jpg, photoId_1.jpeg, etc.
    const baseRe = new RegExp(`^(${escapeRegExp(attachmentId)}_\\d+)`)
    const allEntries = Object.entries(doc._attachments ?? {}).filter(([key]) =>
        baseRe.test(key),
    )

    // Group by base id (photoId_1, photoId_2, ...)
    const grouped: Record<string, Array<[string, PouchDB.Core.Attachment]>> = {}
    for (const [key, value] of allEntries) {
        const match = key.match(baseRe)
        if (match) {
            const base = match[1]
            if (!grouped[base]) grouped[base] = []
            grouped[base].push([key, value])
        }
    }

    const result: PhotoAttachment[] = []
    for (const base in grouped) {
        const meta = doc.metadata_.attachments[base] as
            | PhotoMetadata
            | undefined
        const entry =
            grouped[base].find(([key]) => {
                return key.endsWith('.jpg')
            }) ??
            grouped[base].find(([key]) => {
                return key.endsWith('.jpeg')
            }) ??
            grouped[base][0]

        if (entry) {
            result.push({
                attachmentId: base,
                attachment: entry[1],
                metadata: meta,
            })
        }
    }
    return result
}
