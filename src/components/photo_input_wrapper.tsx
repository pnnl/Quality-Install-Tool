import ImageBlobReduce from 'image-blob-reduce'
import React, {FC} from 'react'
import heicConvert from 'heic-convert'
//import heic2jpg from 'heic-jpg'

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

        const upsertPhoto = (img_file: Blob) => {
          

          // Modification for Test Photo meta data module #45  - Start */ 
          if (img_file.type == 'image/heic') 
          {
             /* heic2any(
              { blob: img_file, toType: "image/jpeg", quality: 0.5, // cuts the quality and size by half
              }).then (jpeg_blob => 
                {
                 //console.log(jpeg_blob)
                  
                 const blob = new Blob([jpeg_blob as BlobPart], {
                  type: 'image/jpeg',
                });
                 console.log(blob)
                 upsertAttachment(blob, id)
                 console.log("hei2any input", img_file)
                 console.log("hei2any output", jpeg_blob)
                });*/

                img_file.arrayBuffer().then (arrayBuffer => {
              

                  console.log("img_file arrayBuffer", arrayBuffer)
                  const outputBuffer = heicConvert({buffer: arrayBuffer, format: 'JPEG' }).then (outputBuffer =>
                    {
                      const blob2 = new Blob([outputBuffer], {type: 'image/jpeg'});
                      //upsertAttachment(blob, id)
                      console.log("heicConvert input", img_file)
                      console.log("heicConvert output", blob2)
                    })
  
                });
               
             
          }      
          else
          {
          // Reduce the image size as needed
          ImageBlobReduce()
          .toBlob(img_file, {max: MAX_IMAGE_DIM})
          .then(blob => {
            upsertAttachment(blob, id)
          })
          }
        }
      
        return (
          <PhotoInput children={children} label={label}
            metadata={(attachments[id]?.metadata as unknown) as PhotoMetadata}
            photo={attachments[id]?.blob} upsertPhoto={upsertPhoto}
             />
        )
      }}
    </StoreContext.Consumer>

)}


export default PhotoInputWrapper
