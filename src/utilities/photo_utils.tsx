import EXIF from 'exif-js'

import Attachment from '../types/attachment.type'
import Metadata from '../types/metadata.type';
import { compareAsc, format } from 'date-fns'

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




// Geolocation data from Web browser
function getPosition(options?: PositionOptions): Promise<Position> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
    }

  );
}



export async function getPhotoMetadata(photo: Blob): Promise<Attachment["metadata"]> {
  //let browserGeoData ={}
 

  return new Promise((resolve) => {


    EXIF.getData(photo, function() {
      const fullMetaData = EXIF.getAllTags(this)
      const {DateTime, DateTimeOriginal, GPSAltitude, GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef} = fullMetaData
      let metadata = {
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
      if (!metadata.timestamp)  // It photo.exif do not have timestamp, this is in iOS devices. For Android, geolocation is fetched from Photo 
      {
        
          getPosition({enableHighAccuracy: true, timeout: 3000}).then((Position) => {
        
            const browsermetadata = {
                    geolocation: {
                      altitude: Position.coords.altitude || null,
                      latitude: Position.coords.latitude ? {
                        deg: Position.coords.latitude,
                        min:'',
                        sec: '',
                        // Note: Naming this property ref would interfere with the React property
                        cRef: ' ' || null
                      } : null,
                      longitude: Position.coords.longitude ? {
                        deg: Position.coords.longitude,
                        min: '',
                        sec: '',
                        cRef: '' || null
                      } : null,
                    },
                    timestamp:  format(Position.timestamp,'yyyy:MM:dd HH:mm:ss') || null
                  }
                  resolve(browsermetadata)
                }).catch((err) => {
                  alert(err.message)
                });
      }
      else
      resolve(metadata)
    })
  })
}
