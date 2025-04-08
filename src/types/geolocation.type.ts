export interface Geolocation {
    altitude?: number | null
    latitude: number | null
    longitude: number | null
}

export type GeolocationSource = 'EXIF' | 'navigator.geolocation'
