import EXIF from 'exif-js'

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
export async function getPhotoMetadata(photo: Blob) {

  return new Promise((resolve) => {
    EXIF.getData(photo, function() {
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

    })
  })
}
