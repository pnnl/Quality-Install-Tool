import PouchDB from 'pouchdb'

import { type Base, type PhotoMetadata } from '../types/database.types'
import { escapeRegExp } from '../utilities/regexp_utils'

export interface PhotoAttachment {
    attachmentId: PouchDB.Core.AttachmentId
    attachment: PouchDB.Core.Attachment
    metadata: PhotoMetadata | undefined
}

export function getPhotoAttachments(
    doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
    attachmentId: PouchDB.Core.AttachmentId,
): Array<PhotoAttachment> {
    const rePhotoAttachmentId = new RegExp(
        `^(${escapeRegExp(attachmentId)})_(0|[1-9][0-9]*)$`,
    )

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
