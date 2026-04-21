import exifr from 'exifr'
import imageCompression from 'browser-image-compression'
import heic2any from 'heic2any'
import pica from 'pica'

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

const HIGH_TEXT_READABILITY_QUALITY = 0.92

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
    // Normalize into a browser-friendly format first so the later canvas and
    // resize steps can treat every photo the same way.
    const normalizedBlob = await normalizePhotoBlob(blob)
    const preprocessedBlob = await preprocessPhoto(normalizedBlob as File)
    const file = preprocessedBlob as File

    console.log('[photo_utils] Starting photo preprocessing and compression', {
        type: file.type,
        sizeBytes: file.size,
    })

    // First try to preserve the original pixel dimensions and only reduce
    // encoding quality. This keeps text sharper when the file can fit.
    const qualityPreservingBlob = await imageCompression(file, {
        maxSizeMB: MAXIMUM_SIZE_MB,
        useWebWorker: true,
        initialQuality: HIGH_TEXT_READABILITY_QUALITY,
        alwaysKeepResolution: true,
        preserveExif: file.type === 'image/jpeg',
    })

    if (qualityPreservingBlob.size <= MAXIMUM_SIZE_MB * 1024 * 1024) {
        console.log('[photo_utils] Used quality-preserving compression', {
            sizeBytes: qualityPreservingBlob.size,
        })
        return qualityPreservingBlob
    }

    try {
        // If quality-only compression is still too large, resize with pica
        // because its resampling is usually clearer for text than basic canvas.
        console.log('[photo_utils] Trying pica resize compression')
        return await resizePhotoWithPica(file)
    } catch (error) {
        console.log('[photo_utils] Falling back to browser-image-compression', {
            error,
        })
        return await imageCompression(file, {
            maxSizeMB: MAXIMUM_SIZE_MB,
            useWebWorker: true,
            maxWidthOrHeight: Math.max(MAXIMUM_HEIGHT_PX, MAXIMUM_WIDTH_PX),
            initialQuality: RESIZED_IMAGE_QUALITY,
            preserveExif: file.type === 'image/jpeg',
        })
    }
}

async function normalizePhotoBlob(blob: Blob): Promise<Blob> {
    if (blob.type !== 'image/heic') {
        return blob
    }

    // HEIC cannot be relied on for browser canvas processing, so convert once
    // up front and let the rest of the pipeline work with JPEG.
    console.log('[photo_utils] Converting HEIC photo to JPEG')

    return (await heic2any({
        blob,
        toType: 'image/jpeg',
    })) as Blob
}

async function preprocessPhoto(file: File): Promise<Blob> {
    const image = await loadImage(file)

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

    console.log('[photo_utils] Preprocessed photo before compression', {
        width: image.naturalWidth,
        height: image.naturalHeight,
    })

    return await canvasToBlob(canvas, file.type, 1)
}

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

async function resizePhotoWithPica(file: File): Promise<Blob> {
    const image = await loadImage(file)
    const [targetWidth, targetHeight] = getConstrainedDimensions(
        image.naturalWidth,
        image.naturalHeight,
    )

    if (
        targetWidth === image.naturalWidth &&
        targetHeight === image.naturalHeight
    ) {
        console.log(
            '[photo_utils] Pica resize skipped because dimensions fit',
            {
                width: image.naturalWidth,
                height: image.naturalHeight,
            },
        )
        return await imageCompression(file, {
            maxSizeMB: MAXIMUM_SIZE_MB,
            useWebWorker: true,
            initialQuality: RESIZED_IMAGE_QUALITY,
            alwaysKeepResolution: true,
            preserveExif: file.type === 'image/jpeg',
        })
    }

    const sourceCanvas = document.createElement('canvas')
    sourceCanvas.width = image.naturalWidth
    sourceCanvas.height = image.naturalHeight

    const sourceContext = sourceCanvas.getContext('2d')

    if (!sourceContext) {
        throw new Error('Canvas rendering is unavailable.')
    }

    sourceContext.drawImage(image, 0, 0)

    const targetCanvas = document.createElement('canvas')
    targetCanvas.width = targetWidth
    targetCanvas.height = targetHeight

    console.log('[photo_utils] Resizing with pica', {
        originalWidth: image.naturalWidth,
        originalHeight: image.naturalHeight,
        targetWidth,
        targetHeight,
    })

    await picaResizer.resize(sourceCanvas, targetCanvas, {
        filter: 'mks2013',
        unsharpAmount: 160,
        unsharpRadius: 0.6,
        unsharpThreshold: 1,
    })

    const resizedBlob = await picaResizer.toBlob(
        targetCanvas,
        file.type,
        RESIZED_IMAGE_QUALITY,
    )

    if (resizedBlob.size <= MAXIMUM_SIZE_MB * 1024 * 1024) {
        console.log('[photo_utils] Pica resize satisfied size limit', {
            sizeBytes: resizedBlob.size,
        })
        return resizedBlob
    }

    console.log('[photo_utils] Pica resize still too large, recompressing', {
        sizeBytes: resizedBlob.size,
    })
    return await imageCompression(resizedBlob as File, {
        maxSizeMB: MAXIMUM_SIZE_MB,
        useWebWorker: true,
        initialQuality: RESIZED_IMAGE_QUALITY,
        alwaysKeepResolution: true,
    })
}

function getConstrainedDimensions(
    width: number,
    height: number,
): [number, number] {
    // Keep aspect ratio while fitting within the configured max photo bounds.
    const scale = Math.min(
        1,
        MAXIMUM_WIDTH_PX / width,
        MAXIMUM_HEIGHT_PX / height,
    )

    return [
        Math.max(1, Math.round(width * scale)),
        Math.max(1, Math.round(height * scale)),
    ]
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
