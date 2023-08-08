import type { FC } from 'react'
import type PhotoMetadata from '../types/photo_metadata.type'
import { isNull } from 'lodash'

/**
 *
 * @param dec Geographic degrees
 * @returns
 */
const GpsCoordStr: FC<PhotoMetadata['geolocation']> = geolocation => {
    const { latitude, longitude } = geolocation
    const geoStr =
        !isNull(latitude) && !isNull(longitude)
            ? Number(latitude).toFixed(4) + ',' + Number(longitude).toFixed(4)
            : null

    return (
        <>
            {!isNull(geoStr) ? (
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
            ) : (
                <span>Missing</span>
            )}
        </>
    )
}

export default GpsCoordStr
