import exifr from 'exifr'

import Attachment from '../types/attachment.type'

/**
 * Get the current geolocation data from the device
 *
 * @returns A GeolocationPosition object
 */
function getCurrentGeolocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            // Allow a cached GPS value to be used for up to a minute
            maximumAge: 0,
            // Assume the GPS is unavailable after a minute
            timeout: 60 * 1000,
        })
    })
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
export async function getMetadataFromCurrentGPSLocation(): Promise<
    Attachment['metadata']
> {
    // Do NOT get the timestamp from position because getCurrentGeolocation
    // may return a cached GeolocationPosition if the lat, long have not
    // changed sufficiently.
    const timestamp = new Date(Date.now()).toISOString()

    try {
        const position = await getCurrentGeolocation()
        const metadata = {
            geolocation: {
                altitude: position.coords.altitude || null,
                latitude: position.coords.latitude || null,
                longitude: position.coords.longitude || null,
            },
            geolocationSource: 'navigator.geolocation',
            timestamp,
            timestampSource: 'Date.now',
        }
        return metadata
    } catch (e) {
        const metadata = {
            geolocation: {
                altitude: null,
                latitude: null,
                longitude: null,
            },
            geolocationSource: null,
            timestamp,
            timestampSource: 'Date.now',
        }
        return metadata
    }
}

/**
 * Retrieves EXIF metadata for the given photo, including the GPS coordinates
 * and the original timestamp. If the GPS coordinates are not present, then
 * delegates to the current device location.
 */
export async function getMetadataFromPhoto(
    blob: Blob,
): Promise<Attachment['metadata']> {
    const tags = await exifr.parse(blob)
    if (tags) {
        const latitude = tags['latitude']
        const longitude = tags['longitude']
        if (latitude && longitude) {
            var timestamp = tags['DateTimeOriginal']?.toISOString()
            var timestampSource = 'EXIF'
            if (!timestamp) {
                // Do NOT get the timestamp from position because getCurrentGeolocation
                // may return a cached GeolocationPosition if the lat, long have not
                // changed sufficiently.
                timestamp = new Date(Date.now()).toISOString()
                timestampSource = 'Date.now'
            }

            const metadata = {
                geolocation: {
                    altitude: tags['GPSAltitude'],
                    latitude,
                    longitude,
                },
                geolocationSource: 'EXIF',
                timestamp,
                timestampSource,
            }
            return metadata
        }
    }

    const metadata = await getMetadataFromCurrentGPSLocation()
    return metadata
}

/* Possible image formats 
    'image/avif',
    'image/heic',
    'image/heif',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/tiff',
*/
// Currently supporting HEIC and JPEG
export const PHOTO_MIME_TYPES: string[] = ['image/heic', 'image/jpeg']

/**
 * Returns `true` if the MIME type for the given blob is supported as a "photo".
 * Otherwise, returns `false`.
 */
export function isPhoto(blob: Blob): boolean {
    return PHOTO_MIME_TYPES.includes(blob.type)
}
