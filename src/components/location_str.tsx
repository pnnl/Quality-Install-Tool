import React, { ReactNode } from 'react'

import { type Location } from '../types/location.type'

interface LocationStrProps {
    location: Location
    separators: [ReactNode, ReactNode, ReactNode]
}

const LocationStr: React.FC<LocationStrProps> = ({ location, separators }) => {
    return (
        <>
            {location.street_address}
            {location.street_address &&
                (location.city || location.state || location.zip_code) &&
                separators[0]}
            {location.city}
            {location.city && location.state && separators[1]}
            {location.state}
            {(location.city || location.state) &&
                location.zip_code &&
                separators[2]}
            {location.zip_code}
        </>
    )
}

export default LocationStr
