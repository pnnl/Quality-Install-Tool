import EXIF from 'exif-js'

import Attachment from '../types/attachment.type'
import Metadata from '../types/metadata.type';
import DateDiff from 'date-diff'

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





function getPosition(options?: PositionOptions): Promise<Position> {
  return new Promise((resolve, reject) => {
   
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
    }

  );
}



export async function getPhotoMetadata(photo: Blob): Promise<Attachment["metadata"]> {
  //const browserGeo = await getPosition()
  return new Promise((resolve) => {
  EXIF.getData(photo, function() {
      const fullMetaData = EXIF.getAllTags(this)
      console.log("fullMetaData",fullMetaData)
      console.log(photo)
      alert("metadata"+JSON.stringify(photo.exifdata))
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
     
      alert(metadata.timestamp)
      if (!metadata.timestamp)
      {
        alert("getPosition")
        getPosition({enableHighAccuracy: true}).then((browserGeoData) =>{
        console.log("browserGeoData",browserGeoData.code)
        alert(browserGeoData.code)
       const safeNewDate = function(localDateTimeStr) {
          let formatteddate = localDateTimeStr
          var match = localDateTimeStr.match(/(\d{4}):(\d{2}):(\d{2})[\sT](\d{2}):(\d{2}):(\d{2})(.(\d+))?/,)
          if (match)
          {
            var [, year, month, date, hours, minutes, seconds, , millseconds] = match
            formatteddate= new Date(
              year,
              Number(month) - 1,
              date,
              hours,
              minutes,
              seconds,
              millseconds || 0,
            )
          }
          return formatteddate
        }
        //const datediff =  new DateDiff(new Date(), safeNewDate(metadata.timestamp))
        console.log(browserGeoData)
        const geoDate = new Date() 
        console.log(geoDate)
        const browsermetadata = {
          geolocation: {
            altitude: browserGeoData.coords.altitude || null,
            latitude: browserGeoData.coords.latitude ? {
              deg: browserGeoData.coords.latitude,
              min:'',
              sec: '',
              // Note: Naming this property ref would interfere with the React property
              cRef: ' ' || null
            } : null,
            longitude: browserGeoData.coords.longitude ? {
              deg: browserGeoData.coords.longitude,
              min: '',
              sec: '',
              cRef: '' || null
            } : null,
          },
          timestamp:  geoDate.toString() || null
        }
        alert(browsermetadata)
        console.log("browser",browsermetadata)
        resolve(browsermetadata)
       }).catch((error) => {alert(error.code)}) 
      }
      else
      resolve(metadata)
      
    }) 
  })
}
