import { type Base } from '../types/database.types'

export function getDefaultProjectPhotoResolution(): string {
    return 'Low (Smaller Files, May Miss Details)'
}

interface PhotoResolutionDoc {
    data_?: Base['data_'] & {
        photo?: {
            resolution?: string
        }
    }
}

export function getPhotoProfileFromDoc(
    doc: PhotoResolutionDoc | undefined,
): string {
    const resolution = doc?.data_?.photo?.resolution?.toLowerCase()

    if (!resolution) {
        return 'low'
    }

    if (resolution.includes('high')) {
        return 'high'
    }

    if (resolution.includes('low') || resolution.includes('preview')) {
        return 'low'
    }

    return 'standard'
}

export interface PhotoProfileSettings {
    formats: string[]
    keepOriginal: boolean
    maxHeight: number
    maxSizeMB: number
    maxWidth: number
    quality: number
}

export function getPhotoProfileSettings(profile: string): PhotoProfileSettings {
    const env = (key: string) => process.env[key]
    const upper = profile.toUpperCase()

    return {
        maxWidth: parseInt(
            env(`REACT_APP_PHOTO_${upper}_MAX_WIDTH_PX`) || '1600',
            10,
        ),
        maxHeight: parseInt(
            env(`REACT_APP_PHOTO_${upper}_MAX_HEIGHT_PX`) || '1200',
            10,
        ),
        maxSizeMB: parseFloat(
            env(`REACT_APP_PHOTO_${upper}_MAX_SIZE_MB`) || '0.5',
        ),
        quality: parseFloat(env(`REACT_APP_PHOTO_${upper}_QUALITY`) || '0.82'),
        formats: (env(`REACT_APP_PHOTO_${upper}_FORMATS`) || 'jpeg').split(','),
        keepOriginal: env(`REACT_APP_PHOTO_${upper}_KEEP_ORIGINAL`) === 'true',
    }
}
