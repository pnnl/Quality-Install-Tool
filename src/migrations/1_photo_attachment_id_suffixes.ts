import PouchDB from 'pouchdb'

import {
    type Base,
    type Installation,
    type Project,
} from '../types/database.types'
import {
    getInstallations,
    getProjects,
    putInstallation,
    putProject,
} from '../utilities/database_utils'

const RE_PHOTO_ATTACHMENT_ID = new RegExp('^(.+_photo)(?:_(0|[1-9][0-9]*))?$')

export async function migrate(db: PouchDB.Database<Base>): Promise<void> {
    // await db.info()

    const projects = await getProjects(db, {
        attachments: true,
        binary: true,
    })

    projects.forEach(async project => {
        const transformedProject =
            transformPhotoAttachmentIdSuffixes<Project>(project)

        await putProject(db, transformedProject)

        const installations = await getInstallations(
            db,
            transformedProject._id,
            undefined,
        )

        installations.forEach(async installation => {
            const transformedInstallation =
                transformPhotoAttachmentIdSuffixes<Installation>(installation)

            await putInstallation(
                db,
                transformedProject._id,
                transformedInstallation,
            )
        })
    })
}

export function transformPhotoAttachmentIdSuffixes<Model>(
    doc: PouchDB.Core.ExistingDocument<Base & Model> & PouchDB.Core.AllDocsMeta,
): PouchDB.Core.ExistingDocument<Base & Model> & PouchDB.Core.AllDocsMeta {
    const targetPhotoAttachmentIdBySourcePhotoAttachmentId: Record<
        PouchDB.Core.AttachmentId,
        PouchDB.Core.AttachmentId
    > = {}

    const currentSuffixByPhotoAttachmentId: Record<
        PouchDB.Core.AttachmentId,
        number
    > = {}

    return {
        ...doc,
        metadata_: {
            ...doc.metadata_,
            attachments: Object.fromEntries(
                Object.entries(doc.metadata_.attachments).map(
                    ([attachmentId, attachmentMetadata]) => {
                        const result = attachmentId.match(
                            RE_PHOTO_ATTACHMENT_ID,
                        )

                        if (result) {
                            const prefix = result[1]
                            // const suffix = parseInt(result[2])

                            const currentSuffix =
                                currentSuffixByPhotoAttachmentId[prefix]

                            if (currentSuffix === undefined) {
                                currentSuffixByPhotoAttachmentId[prefix] = -1
                            }

                            currentSuffixByPhotoAttachmentId[prefix] += 1

                            const newAttachmentId = `${prefix}_${currentSuffixByPhotoAttachmentId[prefix]}`

                            targetPhotoAttachmentIdBySourcePhotoAttachmentId[
                                attachmentId
                            ] = newAttachmentId

                            return [newAttachmentId, attachmentMetadata]
                        } else {
                            return [attachmentId, attachmentMetadata]
                        }
                    },
                ),
            ),
        },
        _attachments: Object.fromEntries(
            Object.entries(doc._attachments ?? {}).map(
                ([attachmentId, attachment]) => {
                    const newAttachmentId = attachmentId.match(
                        RE_PHOTO_ATTACHMENT_ID,
                    )
                        ? targetPhotoAttachmentIdBySourcePhotoAttachmentId[
                              attachmentId
                          ]
                        : attachmentId
                    if (newAttachmentId === undefined) {
                        throw new Error(
                            `Replacement attachment ID not found: ${attachmentId}`,
                        )
                    } else {
                        return [newAttachmentId, attachment]
                    }
                },
            ),
        ),
    }
}

export default migrate
