import React from 'react'

interface GpsCoordStrProps {
    altitude?: number | null
    latitude: number | null
    longitude: number | null
}

const GpsCoordStr: React.FC<GpsCoordStrProps> = ({
    altitude,
    latitude,
    longitude,
}) => {
    if (latitude === null || longitude === null) {
        return <span>Missing</span>
    } else {
        return (
            <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(String(latitude))},${encodeURIComponent(String(longitude))}`}
                rel="noopener noreferrer"
                target="_blank"
            >
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </a>
        )
    }
}

export default GpsCoordStr
