import React, {FC} from 'react'

import {StoreContext} from './store'
import Photo from './photo'
import PhotoMetadata from '../types/photo_metadata.type'
import { filterAttachmentsByIdPrefix } from './photo_input_wrapper'


interface PhotoWrapperProps {
  children: React.ReactNode,
  id: string,
  label: string,
  required: boolean,
}

/**
 * A component that wraps a Photo component in order to tie it to the data store
 * 
 * @param children Content (most commonly markdown text) to be passed on to the Photo
 * component
 * @param id An identifier for the store attachment that represents the photo for 
 * the Photo component
 * @param label The label of the Photo component
 * @param required When unset, the Photo component will only show if there is a
 * photo attachement in the data store with the given id. When set, the Photo component
 * will always show and the Photo component will indicate when the photo is missing.
 */
const PhotoWrapper: FC<PhotoWrapperProps> = ({children, id, label, required}) => {

  return (
    <StoreContext.Consumer>
      {({attachments, doc}) => {
        const photos = filterAttachmentsByIdPrefix(attachments, id)
        
        return (
          <div className='photo-display-container' style={{ display: 'flex', flexWrap: 'wrap' }}>
            { photos.map((photo, index) => {
              return(
                <div key={index} style={{ flexBasis: photos.length % 2 === 1 && photos.length > 1 ? '50%' : '100%' }}>
                  <Photo description={children} id={photo.id} label={label}
                  metadata={photo.data.metadata}
                  photo={photo.data.blob} required={required}
                  />
                </div>
              )
            })
            }
          </div>
        )
      }}
    </StoreContext.Consumer>

)}


export default PhotoWrapper
