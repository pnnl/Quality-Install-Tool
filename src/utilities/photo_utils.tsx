import EXIF from 'exif-js'

import Attachment from '../types/attachment.type'
import { parse, format } from 'date-format-parse'
import {degMinSecToDeg} from './deg_mins_sec_to_dec'
import JSONValue from '../types/json_value.type';
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



/**
 * Geolocation data from Web browser - navigator
 * 
 * 
 * @returns An object of the current location data from device gps:
 */
function getCurrentGeolocation(): Promise<Position> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {enableHighAccuracy: true, timeout: 3000})
    });
}

/**
 * Retrieves geolocation data from the Photo
 * @param photo 
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
function getMetadataFromPhoto(photo: Blob) : Promise<Attachment["metadata"]>  {
  
  return new Promise((resolve) => {
    EXIF.getData(photo, function() {
      const fullMetaData = EXIF.getAllTags(this)
      const {DateTime, DateTimeOriginal, GPSAltitude, GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef} = fullMetaData
      const metadata = {
        geolocation: {
          altitude: GPSAltitude || null,
          latitude: GPSLatitude && GPSLatitudeRef ? {
            dec: degMinSecToDeg(GPSLatitude, GPSLatitudeRef),
          } : null,
          longitude: GPSLongitude && GPSLongitudeRef ? {
            dec: degMinSecToDeg(GPSLongitude, GPSLongitudeRef),
          } : null,
        },
        timestamp: DateTimeOriginal || null
      }
      resolve(metadata)
    })
  });
}

/**
 * Retrieves Geolocation data from device gps
 *   Internally calls getCurrentGeolocation for current location data
 *  
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
function getMetadataFromCurrentGPSLocation() : Promise<Attachment["metadata"]> {
  return new Promise((resolve) => {
    getCurrentGeolocation().then((Position) => {
    const browsermetadata = {
            geolocation: {
              altitude: Position.coords.altitude || null,
              latitude: Position.coords.latitude ? {
                dec: Position.coords.latitude,
              } : null,
              longitude: Position.coords.longitude ? {
                dec: Position.coords.longitude,
              } : null,
            },
            timestamp:  format(Position.timestamp,'YYYY:MM:DD HH:mm:ss') || null
          }
          resolve(browsermetadata)
        }).catch((err) => {
          alert("GPS Location could not be retrieved "+ err.message)
        });
    })

}


/**
 *  
 * Retrieves Goelocation data or PhotoMetadata for the photo: Function for providing the geolocation information for database
 * PhotoMetadata is an object of the form
 * {
 *  geolocation: {
 *    altitude,
 *    latitude,
 *    longitude
 *  },
 *  timestamp
 * }
 * 
 * PhotoMetadata is retrieved from two different options based on the presence if required Metadata
 *        1. From Photo EXIF data   - getMetadataFromPhoto(photo)   
 *        2. From the devise GPS (if not present in Photo)    - getMetadataFromCurrentGPSLocation()  
 * 
 * @param photo 
 * @returns 
 */
export async function getPhotoMetadata(photo: Blob): Promise<Attachment["metadata"]> {
  
  // Fetching geolocation from photo
  const metadataFromPhoto =  await getMetadataFromPhoto(photo)

  return new Promise((resolve) => {

    // Metadata from Photo do not have required fileds such as timestamp and geotagging data. iOS devices.
    if (!metadataFromPhoto.timestamp && !metadataFromPhoto.geolocation?.latitude)  
    {
      resolve(getMetadataFromCurrentGPSLocation())
    }
    else if (metadataFromPhoto.timestamp)  //Metadata from Photo do not have required geotagging data.
    {
        getMetadataFromCurrentGPSLocation().then((metadatafromGPS)=>{
        
          // Calculating the date difference between Timestamp from Photo and current location GPS data
          const datefromPhoto = new Date(parse(metadataFromPhoto.timestamp,'YYYY:MM:DD HH:mm:ss'))
          const datefromGPS = new Date(parse(metadatafromGPS.timestamp,'YYYY:MM:DD HH:mm:ss'))
          var diff = (datefromGPS.getTime() -  datefromPhoto.getTime()) / 1000;
          var hr_diff = diff/ (60 * 60 * 24)

          // if time from Photo is than 2 hrs from the current GPS time, updating the GPS location data from device
          if (hr_diff < 25 )
          {
            metadatafromGPS.timestamp = metadataFromPhoto.timestamp   // Keeping the timesstamp form Photo
            resolve(metadatafromGPS)
          }
          else // GPS locaiton not updated
          {
            resolve(metadataFromPhoto)
          }
        })
    }
    else
    {
      // Metadata from Photo
      resolve(metadataFromPhoto)
    }
    })
  
}
