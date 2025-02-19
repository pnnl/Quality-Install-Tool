import { get } from 'lodash'
import PouchDB from 'pouchdb'
import React from 'react'

import RepeatableInput from './repeatable_input'
import { StoreContext } from '../providers/store_provider'
import {
    type Base,
    type FileMetadata,
    type PhotoMetadata,
} from '../types/database.types'
import { immutableUpsert } from '../utilities/path_utils'
import { escapeRegExp } from '../utilities/regexp_utils'

function _removeAttachmentsAt(
    doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
    path: string,
    index: number,
): PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta {
    // Construct a regular expression to match the attachment IDs for the given
    // path. The path is escaped so that this method is safe to use with nested
    // "repeatable" components.
    const reAttachmentId = new RegExp(
        `^(${escapeRegExp(path)}).(0|[1-9][0-9]*).([^.]+)$`,
    )

    const _attachments: Record<
        PouchDB.Core.AttachmentId,
        PouchDB.Core.FullAttachment
    > = {}

    const attachments: Record<
        PouchDB.Core.AttachmentId,
        FileMetadata | PhotoMetadata
    > = {}

    Object.entries(doc.metadata_.attachments).forEach(
        async ([attachmentId, attachmentMetadata]) => {
            const attachment = doc._attachments?.[attachmentId] as
                | PouchDB.Core.FullAttachment
                | undefined

            const result = attachmentId.match(reAttachmentId)

            if (result) {
                // If the current attachment ID matches the regular expression,
                // then the second capture group is the index for the
                // "repeatable" component.

                const attachmentIndex = parseInt(result[2])

                if (attachmentIndex < index) {
                    // If the index for the attachment is less than the index
                    // for the "repeatable" component that is being removed,
                    // then keep the attachment ID.

                    if (attachment) {
                        _attachments[attachmentId] = attachment
                    }

                    attachments[attachmentId] = attachmentMetadata
                } else if (attachmentIndex > index) {
                    // If the index for the attachment is greater than the index
                    // for the "repeatable" component that is being removed,
                    // then construct a new attachment ID.

                    const newAttachmentId = `${result[1]}.${attachmentIndex - 1}.${result[3]}`

                    if (attachment) {
                        _attachments[newAttachmentId] = attachment
                    }

                    attachments[newAttachmentId] = attachmentMetadata
                } else {
                    // If the index for the attachment is equal to the index for
                    // the "repeatable" component that is being removed, then
                    // do nothing.
                }
            } else {
                // If the current attachment ID does not match the regular
                // expression, then the attachment is for a different component.

                if (attachment) {
                    _attachments[attachmentId] = attachment
                }

                attachments[attachmentId] = attachmentMetadata
            }
        },
    )

    return {
        ...doc,
        _attachments,
        metadata_: {
            ...doc.metadata_,
            attachments,
        },
    }
}

interface RepeatableInputWrapperProps {
    path: string
    label: string
    labelPath?: string
    children: React.ReactNode
    maxValuesCount: number
}

const RepeatableInputWrapper: React.FC<RepeatableInputWrapperProps> = ({
    path,
    label,
    labelPath,
    children,
    maxValuesCount,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc, upsertData, replaceDoc }) => {
                return (
                    <RepeatableInput
                        path={path}
                        label={label}
                        labelPath={labelPath}
                        maxValuesCount={maxValuesCount}
                        values={(doc && get(doc.data_, path)) ?? []}
                        onAdd={async () => {
                            if (doc) {
                                const values = [...(get(doc.data_, path) ?? [])]

                                // @note Initial value for "repeatable" object.
                                //     Currently, the initial value is an empty
                                //     object `{}`.
                                //
                                //     A suggested improvement is to refactor
                                //     this into a prop for this component. This
                                //     would enable template authors to
                                //     prepopulate the values for form fields.
                                values.splice(values.length, 0, {})

                                await upsertData(path, values)
                            }
                        }}
                        onRemove={async (index: number) => {
                            if (doc) {
                                const values = [...(get(doc.data_, path) ?? [])]

                                values.splice(index, 1)

                                // await upsertData(path, values)

                                // @note Removing attachments.
                                //     When values are removed, any attachments
                                //     and their associated metadata must also
                                //     be removed, and the IDs for the remaining
                                //     attachments must be updated so that they
                                //     are consistent with the indexes for the
                                //     remaining values.
                                //
                                //     The {putAttachment} and
                                //     {removeAttachment} functions cannot be
                                //     used for several reasons, including:
                                //     * Calling either method will trigger a
                                //       "change" event and re-render of this
                                //       component.
                                //     * Calling the {putAttachment} function
                                //       will extract the metadata for the
                                //       attachment, so its timestamp will be
                                //       modified.
                                //
                                //     The alternative approach is to remove the
                                //     attachments manually and then to put the
                                //     modified PouchDB document into the
                                //     database. This means that the caller is
                                //     responsible for _upserting_ the new
                                //     values and for updating the "last
                                //     modified at" timestamp.
                                const newDoc = _removeAttachmentsAt(
                                    doc,
                                    path,
                                    index,
                                )

                                const lastModifiedAt = new Date()

                                await replaceDoc(
                                    immutableUpsert(
                                        `data_.${path}`,
                                        {
                                            ...newDoc,
                                            metadata_: {
                                                ...newDoc.metadata_,
                                                last_modified_at:
                                                    lastModifiedAt,
                                            },
                                        },
                                        values,
                                    ),
                                )
                            }
                        }}
                    >
                        {children}
                    </RepeatableInput>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default RepeatableInputWrapper
