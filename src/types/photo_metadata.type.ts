export type GeolocationSource = 'EXIF' | 'navigator.geolocation'

export type TimestampSource = 'EXIF' | 'Date.now'

export interface PhotoMetadata {
    geolocation: {
        altitude?: string | null
        latitude: number | null
        longitude: number | null
    }
    geolocationSource?: GeolocationSource | null
    // TODO: replace string with more precise type
    timestamp: string
    timestampSource?: TimestampSource | null
}

export default PhotoMetadata
