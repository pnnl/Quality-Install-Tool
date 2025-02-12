import exifr from 'exifr'
import imageCompression from 'browser-image-compression'

import { type PhotoMetadata } from '../types/database.types'

const GEOLOCATION_MAXIMUM_AGE: number = parseInt(
    process.env.REACT_APP_GEOLOCATION_MAXIMUM_AGE,
)

const GEOLOCATION_TIMEOUT_MILLIS: number = parseInt(
    process.env.REACT_APP_GEOLOCATION_TIMEOUT_MILLIS,
)

const MAXIMUM_WIDTH_PX: number = parseInt(
    process.env.REACT_APP_PHOTO_MAXIMUM_WIDTH_PX,
)

const MAXIMUM_HEIGHT_PX: number = parseInt(
    process.env.REACT_APP_PHOTO_MAXIMUM_HEIGHT_PX,
)

const MAXIMUM_SIZE_MB: number = parseFloat(
    process.env.REACT_APP_PHOTO_MAXIMUM_SIZE_MB,
)

export const PHOTO_MIME_TYPES: string[] = [
    // 'image/avif',
    'image/heic',
    // 'image/heif',
    'image/jpeg',
    // 'image/jpg',
    // 'image/png',
    // 'image/tiff',
]

/**
 * Compresses an image file (Blob) while maintaining its aspect ratio and
 * ensuring it does not exceed specified size limits.
 *
 * @param {Blob} imageBlob - The original image file as a Blob object that needs
 *     to be compressed.
 * @returns {Promise<Blob | undefined>} A Promise that resolves to the
 *     compressed image file as a Blob. If an error occurs during compression,
 *     it will be caught, and the function may return undefined.
 * @throws {Error} - Throws an error if the compression process fails.
 */
export async function compressPhoto(blob: Blob) {
    return await imageCompression(blob as File, {
        maxSizeMB: MAXIMUM_SIZE_MB,
        useWebWorker: true,
        maxWidthOrHeight: Math.max(MAXIMUM_HEIGHT_PX, MAXIMUM_WIDTH_PX),
    })
}

/**
 * Retrieves EXIF metadata for the given photo, including the GPS coordinates
 * and the original timestamp. If the GPS coordinates are not present, then
 * delegates to the current device location.
 */
export async function getPhotoMetadata(blob: Blob): Promise<PhotoMetadata> {
    const timestamp = new Date().toISOString()
    const timestampSource = 'Date.now'

    const tags = await exifr.parse(blob)

    if (tags) {
        const altitude = tags['altitude'] as number | null
        const latitude = tags['latitude'] as number | null
        const longitude = tags['longitude'] as number | null
        const DateTimeOriginal = tags['DateTimeOriginal'] as Date | null

        if (latitude && longitude) {
            const geolocation = {
                altitude,
                latitude,
                longitude,
            }
            const geolocationSource = 'EXIF'

            if (DateTimeOriginal) {
                return {
                    geolocation,
                    geolocationSource,
                    timestamp: DateTimeOriginal.toISOString(),
                    timestampSource: 'EXIF',
                }
            } else {
                return {
                    geolocation,
                    geolocationSource,
                    timestamp,
                    timestampSource,
                }
            }
        }
    }

    try {
        const geolocationPosition = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    maximumAge: GEOLOCATION_MAXIMUM_AGE,
                    timeout: GEOLOCATION_TIMEOUT_MILLIS,
                })
            },
        )

        return {
            geolocation: {
                altitude: geolocationPosition.coords.altitude,
                latitude: geolocationPosition.coords.latitude,
                longitude: geolocationPosition.coords.longitude,
            },
            geolocationSource: 'navigator.geolocation',
            timestamp,
            timestampSource,
        }
    } catch (cause) {
        return {
            geolocation: {
                altitude: null,
                latitude: null,
                longitude: null,
            },
            geolocationSource: null,
            timestamp,
            timestampSource,
        }
    }
}

/**
 * Returns `true` if the MIME type for the given blob is supported as a "photo".
 * Otherwise, returns `false`.
 */
export function isPhoto(blob: Blob): boolean {
    return PHOTO_MIME_TYPES.includes(blob.type)
}
