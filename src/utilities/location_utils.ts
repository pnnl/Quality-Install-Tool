import { type Location } from '../types/location.type'

export function hasLocation(location: Location): boolean {
    return [
        location.street_address,
        location.city,
        location.state,
        location.zip_code,
    ].some(_isNotBlank)
}

function _isNotBlank(s: string | null): boolean {
    return s !== null && s.trim().length > 0
}
