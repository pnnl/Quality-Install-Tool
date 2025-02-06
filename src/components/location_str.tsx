import React from 'react'

import { type Location } from '../types/location.type'

interface LocationStrProps {
    location: Location
}

const LocationStr: React.FC<LocationStrProps> = ({ location }) => {
    return (
        <>
            {location.street_address}
            {location.street_address &&
                (location.city || location.state || location.zip_code) && (
                    <br />
                )}
            {location.city}
            {location.city && location.state && ', '}
            {location.state}
            {(location.city || location.state) && location.zip_code && ' '}
            {location.zip_code}
        </>
    )
}

export default LocationStr
