import exifr from 'exifr'
import heic2any from 'heic2any'
import pica from 'pica'

import { type PhotoMetadata } from '../types/database.types'
import {
    type PhotoProfileSettings,
    getPhotoProfileSettings,
} from './photo_resolution_utils'

const GEOLOCATION_MAXIMUM_AGE: number = parseInt(
    process.env.REACT_APP_GEOLOCATION_MAXIMUM_AGE,
)

const GEOLOCATION_TIMEOUT_MILLIS: number = parseInt(
    process.env.REACT_APP_GEOLOCATION_TIMEOUT_MILLIS,
)

const HIGH_QUALITY_JPEG_EXPORT = 0.98

const RESIZED_IMAGE_QUALITY = 0.9

const PREPROCESS_CONTRAST = 1.08

const SHARPEN_KERNEL = [0, -1, 0, -1, 5, -1, 0, -1, 0]

const picaResizer = pica()

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
// Returns { blobs: { [format]: Blob }, mainFormat: string }
export async function compressPhoto(blob: Blob, profile: string) {
    const settings = getPhotoProfileSettings(profile)
    const normalized = await normalizePhotoBlob(blob)
    const file = normalized.blob as File
    const mimeType = normalized.mimeType

    // ORIGINAL: if HEIC, convert to JPEG; else, keep original
    if (settings.keepOriginal) {
        if (mimeType === 'image/heic') {
            // Convert to JPEG for browser compatibility
            const jpegBlob = (await heic2any({
                blob: file,
                toType: 'image/jpeg',
            })) as Blob
            return { blobs: { jpeg: jpegBlob }, mainFormat: 'jpeg' }
        } else {
            // Store original
            const ext = mimeType.split('/')[1]
            return { blobs: { [ext]: file }, mainFormat: ext }
        }
    }

    // For all other profiles, output the configured formats.
    const blobs: { [format: string]: Blob } = {}
    for (const format of settings.formats) {
        const outMime = format === 'jpeg' ? 'image/jpeg' : `image/${format}`
        try {
            const processed = await preprocessPhoto(file, outMime, settings)
            blobs[format] = processed
        } catch (err) {
            console.error('Photo compression failed for format:', format, err)
        }
    }
    const mainFormat = settings.formats[0]
    return { blobs, mainFormat }
}

async function normalizePhotoBlob(
    blob: Blob,
): Promise<{ blob: Blob; mimeType: string }> {
    if (blob.type !== 'image/heic') {
        return {
            blob,
            mimeType: blob.type,
        }
    }

    // HEIC cannot be relied on for browser canvas processing, so convert once
    // up front and let the rest of the pipeline work with JPEG.
    return {
        blob: (await heic2any({
            blob,
            toType: 'image/jpeg',
        })) as Blob,
        mimeType: 'image/jpeg',
    }
}

/**
 * Preprocesses an image before compression or resizing to improve readability and quality.
 *
 * Steps:
 * 1. Loads the image into a canvas and applies a contrast and sharpening filter (see applyContrastAndSharpen).
 *    This helps preserve text and edge clarity during later compression or resizing.
 * 2. If the image already fits within the target dimensions, it is exported directly to a Blob.
 * 3. If resizing is needed, uses pica to resize the image to the target dimensions for high-quality resampling.
 *
 * This function is a key part of the photo pipeline, ensuring that images retain important visual details
 * and are optimized for size and clarity before being saved or uploaded.
 *
 * @param file The input image file to preprocess.
 * @param mimeType The desired output MIME type (e.g., 'image/jpeg').
 * @returns A Promise resolving to a Blob of the preprocessed image.
 */
async function preprocessPhoto(
    file: File,
    mimeType: string,
    settings: PhotoProfileSettings,
): Promise<Blob> {
    const image = await loadImage(file)
    const scale = Math.min(
        1,
        settings.maxWidth / image.naturalWidth,
        settings.maxHeight / image.naturalHeight,
    )
    const targetWidth = Math.max(1, Math.round(image.naturalWidth * scale))
    const targetHeight = Math.max(1, Math.round(image.naturalHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    const context = canvas.getContext('2d', { willReadFrequently: true })

    if (!context) {
        throw new Error('Canvas rendering is unavailable.')
    }

    // Apply a small readability pass before compression so text edges survive
    // the later size reduction a little better.
    context.drawImage(image, 0, 0)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const enhancedData = applyContrastAndSharpen(imageData)

    context.putImageData(enhancedData, 0, 0)

    if (
        targetWidth === image.naturalWidth &&
        targetHeight === image.naturalHeight
    ) {
        return await canvasToBlob(
            canvas,
            mimeType,
            settings.quality ||
                (mimeType === 'image/jpeg' ? HIGH_QUALITY_JPEG_EXPORT : 1),
        )
    }

    const targetCanvas = document.createElement('canvas')
    targetCanvas.width = targetWidth
    targetCanvas.height = targetHeight

    await picaResizer.resize(canvas, targetCanvas, {
        filter: 'mks2013',
        unsharpAmount: 160,
        unsharpRadius: 0.6,
        unsharpThreshold: 1,
    })

    return await canvasToBlob(
        targetCanvas,
        mimeType,
        settings.quality || RESIZED_IMAGE_QUALITY,
    )
}

/**
 * Enhances an image by first applying a contrast adjustment and then sharpening it using a 3x3 convolution kernel.
 *
 * - Contrast adjustment: Each RGB channel is adjusted using a fixed contrast factor (PREPROCESS_CONTRAST),
 *   which helps make text and edges more distinct before compression or resizing.
 *
 * - Sharpening: After contrast, a 3x3 sharpening kernel (SHARPEN_KERNEL) is applied to each pixel and channel.
 *   This kernel emphasizes differences with neighboring pixels, making edges and fine details clearer.
 *   The result is an image that better preserves readability and clarity, especially for text, after
 *   subsequent compression or resizing steps.
 *
 * This function is used in the photo preprocessing pipeline to improve the quality of images before they
 * are compressed or resized, helping to maintain important visual details.
 *
 * @param imageData The input ImageData to enhance.
 * @returns A new ImageData object with enhanced contrast and sharpness.
 */
function applyContrastAndSharpen(imageData: ImageData): ImageData {
    const { data, width, height } = imageData
    const contrasted = new Uint8ClampedArray(data)

    for (let index = 0; index < contrasted.length; index += 4) {
        contrasted[index] = applyContrast(contrasted[index])
        contrasted[index + 1] = applyContrast(contrasted[index + 1])
        contrasted[index + 2] = applyContrast(contrasted[index + 2])
    }

    const sharpened = new Uint8ClampedArray(contrasted)

    // Run a simple 3x3 sharpen kernel after the contrast adjustment.
    for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
            const pixelIndex = (y * width + x) * 4

            for (let channel = 0; channel < 3; channel += 1) {
                let value = 0
                let kernelIndex = 0

                for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
                    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
                        const sampleIndex =
                            ((y + offsetY) * width + (x + offsetX)) * 4 +
                            channel
                        value +=
                            contrasted[sampleIndex] *
                            SHARPEN_KERNEL[kernelIndex]
                        kernelIndex += 1
                    }
                }

                sharpened[pixelIndex + channel] = clampColor(value)
            }
        }
    }

    return new ImageData(sharpened, width, height)
}

function applyContrast(value: number): number {
    return clampColor((value - 128) * PREPROCESS_CONTRAST + 128)
}

function clampColor(value: number): number {
    return Math.max(0, Math.min(255, Math.round(value)))
}

async function loadImage(file: File): Promise<HTMLImageElement> {
    const imageUrl = URL.createObjectURL(file)
    try {
        return await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image()
            image.onload = () => {
                resolve(image)
            }
            image.onerror = () => {
                reject(new Error('Image loading failed.'))
            }
            image.src = imageUrl
        })
    } finally {
        URL.revokeObjectURL(imageUrl)
    }
}

async function canvasToBlob(
    canvas: HTMLCanvasElement,
    mimeType: string,
    quality?: number,
): Promise<Blob> {
    return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            blob => {
                if (blob) {
                    resolve(blob)
                    return
                }

                reject(new Error('Canvas export failed.'))
            },
            mimeType,
            quality,
        )
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
 * and the original timestamp. If the GPS coordinates are not present, then
 * delegates to the current device location.
 */
export async function getPhotoMetadata(
    blob: Blob,
    storedBlob?: Blob,
): Promise<PhotoMetadata> {
    const timestamp = new Date().toISOString()
    const timestampSource = 'Date.now'
    const { height, width } = await getImageDimensions(storedBlob ?? blob)

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
                    imageHeightPx: height,
                    imageWidthPx: width,
                    timestamp: DateTimeOriginal.toISOString(),
                    timestampSource: 'EXIF',
                }
            } else {
                return {
                    geolocation,
                    geolocationSource,
                    imageHeightPx: height,
                    imageWidthPx: width,
                    timestamp,
                    timestampSource,
                }
            }
        }
    }

    if (!('geolocation' in navigator)) {
        return {
            geolocation: {
                altitude: null,
                latitude: null,
                longitude: null,
            },
            geolocationWarning:
                'Location services are not available in this browser. The photo was uploaded without GPS coordinates.',
            geolocationSource: null,
            imageHeightPx: height,
            imageWidthPx: width,
            timestamp,
            timestampSource,
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
            imageHeightPx: height,
            imageWidthPx: width,
            timestamp,
            timestampSource,
        }
    } catch (cause) {
        const geolocationError = cause as GeolocationPositionError | undefined

        return {
            geolocation: {
                altitude: null,
                latitude: null,
                longitude: null,
            },
            geolocationWarning: getGeolocationWarningMessage(geolocationError),
            geolocationSource: null,
            imageHeightPx: height,
            imageWidthPx: width,
            timestamp,
            timestampSource,
        }
    }
}

async function getImageDimensions(
    blob: Blob,
): Promise<{ height: number; width: number }> {
    const image = await loadImage(blob as File)

    return {
        height: image.naturalHeight,
        width: image.naturalWidth,
    }
}

function getGeolocationWarningMessage(
    error?: GeolocationPositionError,
): string {
    switch (error?.code) {
        case 1:
            return 'Location services are blocked. Enable browser location access if you want GPS coordinates saved with the photo.'
        case 2:
            return 'Location services are currently unavailable. The photo was uploaded without GPS coordinates.'
        case 3:
            return 'Location lookup timed out. The photo was uploaded without GPS coordinates.'
        default:
            return 'GPS coordinates could not be retrieved. The photo was uploaded without GPS coordinates.'
    }
}

/**
 * Returns `true` if the MIME type for the given blob is supported as a "photo".
 * Otherwise, returns `false`.
 */
export function isPhoto(blob: Blob): boolean {
    return PHOTO_MIME_TYPES.includes(blob.type)
}
