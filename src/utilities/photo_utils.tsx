import EXIF from 'exif-js'

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
    const position = await getCurrentGeolocation()
    const metadata = {
        geolocation: {
            altitude: position.coords.altitude || null,
            latitude: position.coords.latitude || null,
            longitude: position.coords.longitude || null,
        },
        // Do NOT get the timestamp from position because getCurrentGeolocation
        // may return a cached GeolocationPosition if the lat, long have not
        // changed sufficiently.
        timestamp: new Date(Date.now()).toISOString(),
    }
    return metadata
}
