import ImageBlobReduce from 'image-blob-reduce'
import React, {FC} from 'react'

import {StoreContext} from './store'
import PhotoInput from './photo_input'
import PhotoMetadata from '../types/photo_metadata.type'
import { getPhotoMetadata } from '../utilities/photo_utils'

const MAX_IMAGE_DIM = 1280

interface PhotoInputWrapperProps {
  children: React.ReactNode
  id: string,
  label: string
}

/**
 * A component that wraps a PhotoInput component in order to tie it to the data store
 * 
 * @param children Content (most commonly markdown text) to be passed on as the PhotInput
 * children
 * @param id An identifier for the store attachment that represents the photo for 
 * the PhotoInput component
 * @param label The label of the PhotoInput component
 */
const PhotoInputWrapper: FC<PhotoInputWrapperProps> = ({children, id, label}) => {

  return (
    <StoreContext.Consumer>
      {({attachments, upsertAttachment}) => {

        const upsertPhoto = (file: Blob) => {
          // Reduce the image size as needed
          ImageBlobReduce()
          .toBlob(file, {max: MAX_IMAGE_DIM})
          .then(blob => {
            upsertAttachment(blob, id)
          })
        }

        return (
          <PhotoInput children={children} id={id} label={label}
            metadata={(attachments[id]?.metadata as unknown) as PhotoMetadata}
            photo={attachments[id]?.blob} upsertPhoto={upsertPhoto}
             />
        )
      }}
    </StoreContext.Consumer>

)}


export default PhotoInputWrapper
