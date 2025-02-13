import { get } from 'lodash'
import PouchDB from 'pouchdb'
import React from 'react'

import Photo from './photo'
import { StoreContext } from '../providers/store_provider'
import { type Base } from '../types/database.types'
import {
    type PhotoAttachment,
    getPhotoAttachments,
} from '../utilities/photo_attachment_utils'

interface PhotoWrapperProps {
    children: React.ReactNode
    id: string
    label: string
    required: boolean
    parent?: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta
}

const PhotoWrapper: React.FC<PhotoWrapperProps> = ({
    children,
    id,
    label,
    required,
    parent,
}) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return (
                    <Photo
                        label={label}
                        description={children}
                        required={required}
                        photoAttachments={
                            parent
                                ? getPhotoAttachments(parent, id)
                                : doc
                                  ? getPhotoAttachments(doc, id)
                                  : []
                        }
                        noteValue={(doc && get(doc.data_, `${id}_note`)) ?? ''}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PhotoWrapper
