import { isNull } from 'lodash'
import React from 'react'

interface GpsCoordStrProps {
    altitude?: number | null
    latitude: number | null
    longitude: number | null
}

/**
 *
 * @param dec Geographic degrees
 * @returns
 */
const GpsCoordStr: React.FC<GpsCoordStrProps> = ({
    altitude,
    latitude,
    longitude,
}) => {
    const geoStr =
        !isNull(latitude) && !isNull(longitude)
            ? Number(latitude).toFixed(4) + ',' + Number(longitude).toFixed(4)
            : null

    return (
        <>
            {!isNull(geoStr) ? (
                <>
                    <a
                        href={
                            'https://www.google.com/maps/search/?api=1&query=' +
                            geoStr
                        }
                        rel="noreferrer"
                        target="_blank"
                    >
                        {geoStr}
                    </a>
                </>
            ) : (
                <span>Missing</span>
            )}
        </>
    )
}

export default GpsCoordStr
