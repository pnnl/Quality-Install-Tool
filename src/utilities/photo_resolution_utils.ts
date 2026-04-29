import { type Base } from '../types/database.types'

export function getDefaultProjectPhotoResolution(): string {
    const profile = (
        process.env.REACT_APP_PHOTO_PROFILE_DEFAULT ?? 'standard'
    ).toLowerCase()

    switch (profile) {
        case 'preview':
        case 'low':
            return 'Low (Smaller Files, May Miss Details)'
        case 'high':
            return 'High (Larger Files, Best Detail)'
        default:
            return 'Standard (Balanced)'
    }
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
        return 'standard'
    }

    if (resolution.includes('high')) {
        return 'high'
    }

    if (resolution.includes('low') || resolution.includes('preview')) {
        return 'preview'
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
