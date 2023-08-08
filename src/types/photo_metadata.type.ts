interface PhotoMetadata {
    geolocation: {
        altitude?: string | null
        latitude: number | null
        longitude: number | null
    }
    // TODO: replace string with more precise type
    timestamp: string
}

export default PhotoMetadata
