import { type Base } from '../types/database.types'

export type PhotoResolutionProfile = 'low' | 'standard' | 'high'

export function normalizePhotoResolution(
    resolution: string | undefined,
    defaultProfile?: PhotoResolutionProfile,
): PhotoResolutionProfile {
    const fallback = defaultProfile || 'standard'
    const normalized = resolution?.toLowerCase().trim()

    if (!normalized) {
        return fallback
    }

    if (normalized === 'high' || normalized.includes('high')) {
        return 'high'
    }

    if (
        normalized === 'low' ||
        normalized.includes('low') ||
        normalized.includes('preview')
    ) {
        return 'low'
    }

    return 'standard'
}

export function getDefaultProjectPhotoResolution(): string {
    return 'standard'
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
    const defaultProfile = normalizePhotoResolution(
        process.env.REACT_APP_PHOTO_PROFILE_DEFAULT || 'standard',
    )
    const resolution = doc?.data_?.photo?.resolution

    return normalizePhotoResolution(resolution, defaultProfile)
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
