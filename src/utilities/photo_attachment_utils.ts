import PouchDB from 'pouchdb'

import { type Base, type PhotoMetadata } from '../types/database.types'

export interface PhotoAttachment {
    attachmentId: PouchDB.Core.AttachmentId
    attachment: PouchDB.Core.Attachment
    metadata: PhotoMetadata | undefined
}

export function getPhotoAttachments(
    doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
    attachmentId: PouchDB.Core.AttachmentId,
): Array<PhotoAttachment> {
    return Object.entries(doc._attachments ?? {})
        .filter(([key]) => {
            return key.startsWith(attachmentId)
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
