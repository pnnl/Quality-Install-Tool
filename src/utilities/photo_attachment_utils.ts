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
    const rePhotoAttachmentId = getPhotoAttachmentRegExp(attachmentId)

    return Object.entries(doc._attachments ?? {})
        .filter(([key]) => {
            return key.match(rePhotoAttachmentId)
        })
        .map(([key, value]) => {
            return {
                attachmentId: key,
                attachment: value,
                metadata: doc.metadata_.attachments[key] as
                    | PhotoMetadata
                    | undefined,
            }
        })
}
