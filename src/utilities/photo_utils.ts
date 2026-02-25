import exifr from 'exifr'
import imageCompression from 'browser-image-compression'

import { type PhotoMetadata } from '../types/database.types'
import { getDeviceType } from './device_detection_utils'

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
    // 'image/webp',
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
 * Processes an image file by compressing and converting it to WebP format.
 *
 * @param {File} file - The image file to process.
 * @returns {Promise<Blob>} A Promise that resolves to the processed image as a Blob.
 * @throws {Error} Throws an error if the image processing fails.
 */
export async function processImage(file: File): Promise<Blob> {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
    }
    try {
        const compressedFile = await imageCompression(file, options)
        return compressedFile
    } catch (error) {
        throw new Error('Image processing failed. Please try another image.')
    }
}

/**
 * Retrieves EXIF metadata for the given photo, including the GPS coordinates
 * and the original timestamp. If the GPS coordinates are not present in EXIF,
 * attempts to retrieve location from device's navigator.geolocation API.
 *
 * For mobile (Android/iOS): Tries EXIF first, then device location as fallback.
 * For desktop: Tries EXIF first (if available), then device location as fallback.
 * When importing documents: Uses data present in the JSON file without fallback.
 */
export async function getPhotoMetadata(blob: Blob): Promise<PhotoMetadata> {
    const timestamp = new Date().toISOString()
    const timestampSource = 'Date.now'
    const uploadId = Math.random().toString(36).substring(7) // Unique ID for this upload
    let geolocationError: string | null = null

    console.info(
        `[PhotoUpload-${uploadId}] Starting metadata extraction for file: ${blob.type}, Size: ${(blob.size / 1024).toFixed(2)}KB`,
    )

    // Step 1: Try to extract EXIF data
    let tags: Record<string, unknown> | undefined
    let exifExtractionFailed = false

    try {
        tags = await exifr.parse(blob)
        if (tags) {
            console.info(
                `[PhotoUpload-${uploadId}] EXIF data successfully extracted. Keys found: ${Object.keys(tags).length}`,
            )
        } else {
            console.info(
                `[PhotoUpload-${uploadId}] EXIF data is empty - no metadata tags found in file`,
            )
        }
    } catch (cause) {
        exifExtractionFailed = true
        console.warn(
            `[PhotoUpload-${uploadId}] ERROR-001: EXIF extraction failed. File may not contain EXIF data.`,
            { error: cause instanceof Error ? cause.message : String(cause) },
        )
    }

    // Step 2: Check if EXIF contains valid geolocation
    if (tags && !exifExtractionFailed) {
        const altitude = tags['altitude'] as number | null
        const latitude = tags['latitude'] as number | null
        const longitude = tags['longitude'] as number | null
        const DateTimeOriginal = tags['DateTimeOriginal'] as Date | null

        if (latitude && longitude) {
            // EXIF has valid GPS coordinates
            const geolocation = {
                altitude,
                latitude,
                longitude,
            }
            const geolocationSource = 'EXIF'

            console.info(
                `[PhotoUpload-${uploadId}] SUCCESS: GPS coordinates found in EXIF. Location: (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            )

            if (DateTimeOriginal) {
                return {
                    geolocation,
                    geolocationSource,
                    geolocationError: null,
                    timestamp: DateTimeOriginal.toISOString(),
                    timestampSource: 'EXIF',
                }
            } else {
                return {
                    geolocation,
                    geolocationSource,
                    geolocationError: null,
                    timestamp,
                    timestampSource,
                }
            }
        } else {
            // EXIF was extracted but has no GPS coordinates
            geolocationError = 'EXIF'
            console.warn(
                `[PhotoUpload-${uploadId}] ERROR-002: EXIF data exists but GPS coordinates are missing/empty. Lat: ${latitude}, Lon: ${longitude}`,
            )
        }
    } else if (exifExtractionFailed) {
        // EXIF extraction failed
        console.warn(
            `[PhotoUpload-${uploadId}] ERROR-001 (Continued): EXIF extraction failed. Proceeding to fallback method.`,
        )
    }

    // Step 3: Fallback to device geolocation
    try {
        console.info(
            `[PhotoUpload-${uploadId}] Attempting fallback: Requesting device location via navigator.geolocation...`,
        )

        const geolocationPosition = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    maximumAge: GEOLOCATION_MAXIMUM_AGE,
                    timeout: GEOLOCATION_TIMEOUT_MILLIS,
                })
            },
        )

        const latitude = geolocationPosition.coords.latitude
        const longitude = geolocationPosition.coords.longitude
        const altitude = geolocationPosition.coords.altitude

        console.info(
            `[PhotoUpload-${uploadId}] SUCCESS (Fallback): Device location obtained. Location: (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        )

        return {
            geolocation: {
                altitude,
                latitude,
                longitude,
            },
            geolocationSource: 'navigator.geolocation',
            geolocationError: null,
            timestamp,
            timestampSource,
        }
    } catch (cause) {
        // Device location also failed
        const errorMsg = cause instanceof Error ? cause.message : String(cause)
        console.error(
            `[PhotoUpload-${uploadId}] ERROR-003: Both EXIF extraction and device location fallback failed.`,
            { error: errorMsg },
        )

        // Set error based on which stage failed
        if (!geolocationError) {
            geolocationError = 'navigator.geolocation'
        }

        return {
            geolocation: {
                altitude: null,
                latitude: null,
                longitude: null,
            },
            geolocationSource: null,
            geolocationError,
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

/**
 * Gets user-friendly geolocation error message based on the error source.
 * Provides device-specific (mobile/desktop) guidance and FAQ links.
 *
 * @param geolocationSource - The source of the error ('EXIF', 'navigator.geolocation', or null/undefined for all failed)
 * @returns Object with error message, FAQ link flag, and device-appropriate topic
 */
export function getGeolocationErrorInfo(
    geolocationSource: string | null | undefined,
): { message: string; showFaqLink: boolean; faqTopic?: string } {
    const deviceType = getDeviceType() === 'mobile' ? 'phone' : 'computer'
    const isMobileDevice = getDeviceType() === 'mobile'

    if (geolocationSource === 'EXIF') {
        return {
            message:
                `The location data was found in the photo file but is empty. This happens when:\n\n` +
                `• The photo was taken without GPS turned on\n` +
                `• Location permission was not granted when taking the photo\n\n` +
                `Location services on the ${deviceType} were unavailable as a backup.\n\n` +
                `💡 To fix this: Enable location services and GPS on the ${deviceType}, then delete this photo and upload it again.`,
            showFaqLink: true,
            faqTopic: isMobileDevice ? 'mobile' : 'desktop',
        }
    } else if (geolocationSource === 'navigator.geolocation') {
        return {
            message:
                `The photo does not contain location information, and the ${deviceType}'s current location could not be obtained.\n\n` +
                `This usually happens when:\n\n` +
                `• Location services are turned off\n` +
                `• The app does not have permission to access location services\n` +
                `• The GPS signal is too weak (on mobile)\n\n` +
                `💡 To fix this: Enable location services on the ${deviceType}, then delete this photo and upload it again.`,
            showFaqLink: true,
            faqTopic: isMobileDevice ? 'mobile' : 'desktop',
        }
    } else {
        return {
            message:
                `Location information for this photo could not be found.\n\n` +
                `This could happen because:\n\n` +
                `• The photo file doesn't contain location data\n` +
                `• The app does not have permission to access location services on the ${deviceType}\n` +
                `• The GPS isn't working or doesn't have a signal\n` +
                `• The photo was imported without location information\n\n` +
                `💡 To fix this: Enable location services on the ${deviceType} and try uploading the photo again. If the photo file doesn't have location data, delete it and take a new one with GPS enabled.`,
            showFaqLink: true,
            faqTopic: isMobileDevice ? 'mobile' : 'desktop',
        }
    }
}
