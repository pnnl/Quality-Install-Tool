import EXIF from 'exif-js'
import ExifReader from 'exifreader';

import Attachment from '../types/attachment.type'
import Metadata from '../types/metadata.type';

/**
 * Extracts the timestamp and geolocation data from a JPEG photo's
 * metadata
 * 
 * @remarks
 * The caller must ensure that the photo is in jpeg format.
 * 
 * @param photo A Blob for a jpeg photo
 * @returns An object of the form:
 * {
 *  geolocation: {
 *    altitude,
 *    latitude,
 *    longitude
 *  },
 *  timestamp
 * }
 */
export async function getPhotoMetadata(photo: Blob): Promise<Attachment["metadata"]> {

  return new Promise((resolve) => {

    if (photo.type =='image/heic' || photo.type =='image/jpeg'){
      photo.arrayBuffer().then(arrayBuffer =>
      {
        console.log ("Entered", photo.type)
        const tags =  ExifReader.load(arrayBuffer);
        console.log ("tags", tags)
        const {DateTimeOriginal, GPSAltitude, GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef} = tags
        const metadata = {
          geolocation: {
            altitude: GPSAltitude || null,
            latitude: GPSLatitude ? {
              deg: GPSLatitude.value[0],
              min: GPSLatitude.value[1],
              sec: GPSLatitude.value[2],
              // Note: Naming this property ref would interfere with the React property
              cRef: GPSLatitudeRef?.value || null
            } : null,
            longitude: GPSLongitude ? {
              deg: GPSLongitude.value[0],
              min: GPSLongitude.value[1],
              sec: GPSLongitude.value[2],
              cRef: GPSLongitudeRef?.value || null
            } : null,
          },
          timestamp: DateTimeOriginal?.description || null
        }
        console.log("metadata",metadata)
        resolve(metadata)
        })
        
      }




   /* EXIF.getData(photo, function() {
      const fullMetaData = EXIF.getAllTags(this)
      const {DateTimeOriginal, GPSAltitude, GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef} = fullMetaData
      const metadata = {
        geolocation: {
          altitude: GPSAltitude || null,
          latitude: GPSLatitude ? {
            deg: GPSLatitude[0],
            min: GPSLatitude[1],
            sec: GPSLatitude[2],
            // Note: Naming this property ref would interfere with the React property
            cRef: GPSLatitudeRef || null
          } : null,
          longitude: GPSLongitude ? {
            deg: GPSLongitude[0],
            min: GPSLongitude[1],
            sec: GPSLongitude[2],
            cRef: GPSLongitudeRef || null
          } : null,
        },
        timestamp: DateTimeOriginal || null
      }
      resolve(metadata)

    }) */
  })
}
