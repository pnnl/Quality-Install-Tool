import { type Location } from '../types/location.type'

export function someLocation(location?: Location): boolean {
    if (location) {
        return [
            location.street_address,
            location.city,
            location.state,
            location.zip_code,
        ].some(s => {
            if (s) {
                return s.trim().length > 0
            } else {
                return false
            }
        })
    } else {
        return false
    }
}
