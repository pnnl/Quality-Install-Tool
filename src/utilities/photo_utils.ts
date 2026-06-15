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

const MIN_LOSSY_QUALITY = 0.45

const QUALITY_STEP = 0.07

const MAX_SIZE_ENFORCEMENT_PASSES = 8

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
    'image/webp',
]

export interface CompressedPhotoResult {
    blobs: Record<string, Blob>
    mainFormat: string
}

/**
 * Compresses an image file (Blob) while maintaining its aspect ratio and
 * ensuring it does not exceed specified size limits.
 *
 * @param {Blob} blob - The original image file as a Blob object.
 * @param {string} profile - Photo profile key used to read sizing and quality
 *     constraints.
 * @returns {Promise<CompressedPhotoResult>} A Promise that resolves to one or
 *     more compressed format blobs and the primary format key.
 * @throws {Error} - Throws when no output format can be produced within
 *     configured constraints.
 */
export async function compressPhoto(
    blob: Blob,
    profile: string,
): Promise<CompressedPhotoResult> {
    const settings = getPhotoProfileSettings(profile)
    const originalMimeType = blob.type
    const normalized = await normalizePhotoBlob(blob)
    const file = normalized.blob as File
    const mimeType = normalized.mimeType

    // ORIGINAL: if HEIC, convert to JPEG; else, keep original
    if (settings.keepOriginal) {
        if (originalMimeType === 'image/heic') {
            return { blobs: { jpeg: normalized.blob }, mainFormat: 'jpeg' }
        }

        const fallbackMime = originalMimeType || mimeType || 'image/jpeg'
        const ext = fallbackMime.split('/')[1] || 'jpeg'
        return { blobs: { [ext]: blob }, mainFormat: ext }
    }
    const isWebPInput = mimeType === 'image/webp'

    // For all other profiles, output the configured formats.
    // If input is WebP, keep processing/storing in WebP instead of JPEG.
    const formats = Array.from(
        new Set(
            settings.formats
                .map(format => format.trim().toLowerCase())
                .filter(Boolean)
                .map(format => {
                    if (isWebPInput && format === 'jpeg') {
                        return 'webp'
                    }

                    return format
                }),
        ),
    )

    const blobs: { [format: string]: Blob } = {}
    for (const format of formats) {
        const outMime = format === 'jpeg' ? 'image/jpeg' : `image/${format}`
        try {
            const processed = await preprocessPhoto(file, outMime, settings)
            blobs[format] = processed
        } catch (err) {
            console.error('Photo compression failed for format:', format, err)
        }
    }
    // If every configured conversion fails, fail explicitly rather than
    // silently storing an oversized image.
    if (Object.keys(blobs).length === 0) {
        throw new Error(
            `Unable to compress photo within ${settings.maxSizeMB} MB for profile ${profile}.`,
        )
    }

    const mainFormat = formats[0]
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

    let outputCanvas: HTMLCanvasElement
    let initialQuality: number

    if (
        targetWidth === image.naturalWidth &&
        targetHeight === image.naturalHeight
    ) {
        outputCanvas = canvas
        initialQuality =
            settings.quality ||
            (mimeType === 'image/jpeg' ? HIGH_QUALITY_JPEG_EXPORT : 1)
    } else {
        const targetCanvas = document.createElement('canvas')
        targetCanvas.width = targetWidth
        targetCanvas.height = targetHeight

        await picaResizer.resize(canvas, targetCanvas, {
            filter: 'mks2013',
            unsharpAmount: 160,
            unsharpRadius: 0.6,
            unsharpThreshold: 1,
        })

        outputCanvas = targetCanvas
        initialQuality = settings.quality || RESIZED_IMAGE_QUALITY
    }

    return await exportCanvasWithinSizeLimit(
        outputCanvas,
        mimeType,
        initialQuality,
        settings.maxSizeMB,
    )
}

function getMaxBytes(maxSizeMB: number): number {
    if (!Number.isFinite(maxSizeMB) || maxSizeMB <= 0) {
        return 0
    }

    return Math.floor(maxSizeMB * 1024 * 1024)
}

function isLossyMimeType(mimeType: string): boolean {
    return mimeType === 'image/jpeg' || mimeType === 'image/webp'
}

function clampQuality(quality: number): number {
    if (!Number.isFinite(quality)) {
        return 1
    }

    return Math.min(1, Math.max(MIN_LOSSY_QUALITY, quality))
}

async function resizeCanvas(
    sourceCanvas: HTMLCanvasElement,
    width: number,
    height: number,
): Promise<HTMLCanvasElement> {
    const resizedCanvas = document.createElement('canvas')
    resizedCanvas.width = width
    resizedCanvas.height = height

    await picaResizer.resize(sourceCanvas, resizedCanvas, {
        filter: 'mks2013',
        unsharpAmount: 160,
        unsharpRadius: 0.6,
        unsharpThreshold: 1,
    })

    return resizedCanvas
}

async function exportCanvasWithinSizeLimit(
    sourceCanvas: HTMLCanvasElement,
    mimeType: string,
    initialQuality: number,
    maxSizeMB: number,
): Promise<Blob> {
    const maxBytes = getMaxBytes(maxSizeMB)

    if (maxBytes === 0) {
        return await canvasToBlob(sourceCanvas, mimeType, initialQuality)
    }

    let workingCanvas = sourceCanvas
    let bestBlob: Blob | null = null
    const canAdjustQuality = isLossyMimeType(mimeType)

    for (let pass = 0; pass < MAX_SIZE_ENFORCEMENT_PASSES; pass += 1) {
        let quality = clampQuality(initialQuality)
        const maxQualityAttempts = canAdjustQuality
            ? Math.floor((1 - MIN_LOSSY_QUALITY) / QUALITY_STEP) + 2
            : 1

        // Try higher quality first, then step down quality before reducing
        // dimensions again.
        for (
            let qualityAttempt = 0;
            qualityAttempt < maxQualityAttempts;
            qualityAttempt += 1
        ) {
            const blob = await canvasToBlob(
                workingCanvas,
                mimeType,
                canAdjustQuality ? quality : undefined,
            )

            if (!bestBlob || blob.size < bestBlob.size) {
                bestBlob = blob
            }

            if (blob.size <= maxBytes) {
                return blob
            }

            if (!canAdjustQuality || quality <= MIN_LOSSY_QUALITY) {
                break
            }

            quality = Math.max(MIN_LOSSY_QUALITY, quality - QUALITY_STEP)
        }

        if (workingCanvas.width <= 1 || workingCanvas.height <= 1) {
            break
        }

        // Use the measured oversize ratio to compute an adaptive scale step.
        const measuredSize = Math.max(bestBlob?.size || 0, maxBytes + 1)
        const rawScale = Math.sqrt(maxBytes / measuredSize)
        const constrainedScale = Math.max(0.6, Math.min(0.95, rawScale * 0.95))
        const nextWidth = Math.max(
            1,
            Math.floor(workingCanvas.width * constrainedScale),
        )
        const nextHeight = Math.max(
            1,
            Math.floor(workingCanvas.height * constrainedScale),
        )

        if (
            nextWidth === workingCanvas.width &&
            nextHeight === workingCanvas.height
        ) {
            break
        }

        workingCanvas = await resizeCanvas(workingCanvas, nextWidth, nextHeight)
    }

    if (bestBlob) {
        if (bestBlob.size <= maxBytes) {
            return bestBlob
        }

        throw new Error(
            `Unable to compress image within ${maxSizeMB} MB after multiple attempts.`,
        )
    }

    const fallbackBlob = await canvasToBlob(
        sourceCanvas,
        mimeType,
        initialQuality,
    )
    if (fallbackBlob.size <= maxBytes) {
        return fallbackBlob
    }

    throw new Error(
        `Unable to compress image within ${maxSizeMB} MB after multiple attempts.`,
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

function isWebPSupported(): boolean {
    const canvas = document.createElement('canvas')

    if (!canvas.getContext) {
        return false
    }

    return canvas.toDataURL('image/webp').startsWith('data:image/webp')
}

async function loadImage(file: Blob): Promise<HTMLImageElement> {
    if (file.type === 'image/webp' && !isWebPSupported()) {
        throw new Error('WebP is not supported in this browser version.')
    }

    const imageUrl = URL.createObjectURL(file)
    try {
        return await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image()
            image.onload = () => {
                resolve(image)
            }
            image.onerror = () => {
                if (file.type === 'image/webp') {
                    reject(
                        new Error(
                            'WebP is not supported in this browser version.',
                        ),
                    )
                    return
                }

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

    let tags: Record<string, unknown> | null = null

    try {
        // Normalize HEIC to JPEG before parsing EXIF, since exifr can't read HEIC on Windows
        const normalizedBlob =
            blob.type === 'image/heic'
                ? (await normalizePhotoBlob(blob)).blob
                : blob
        tags = (await exifr.parse(normalizedBlob)) as Record<
            string,
            unknown
        > | null
    } catch {
        // Some formats (or browser-decoder outputs) can fail EXIF parsing.
        // Continue with geolocation fallback instead of failing upload.
        tags = null
    }

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
    try {
        const image = await loadImage(blob)

        return {
            height: image.naturalHeight,
            width: image.naturalWidth,
        }
    } catch {
        // Keep photo upload resilient even if a browser cannot decode this
        // image for dimension probing.
        return {
            height: 0,
            width: 0,
        }
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
