import type { FC } from 'react'
import type {
    GeolocationSource,
    PhotoMetadata,
} from '../types/photo_metadata.type'
import { isNull } from 'lodash'

interface GpsCoordStrProps {
    altitude?: string | null
    latitude: number | null
    longitude: number | null
    source?: GeolocationSource | null
    error?: any
}

/**
 *
 * @param dec Geographic degrees
 * @returns
 */
const GpsCoordStr: FC<GpsCoordStrProps> = geolocation => {
    const { latitude, longitude, source, error } = geolocation || {}
    if (error) console.log(error)
    const geoStr =
        latitude && longitude
            ? `${Number(latitude).toFixed(4)},${Number(longitude).toFixed(4)}`
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
                <span>
                    Missing{'  '}
                    {error && (
                        <span className="error">
                            (Check the location service on your device and try
                            uploading again.)
                        </span>
                    )}
                </span>
            )}
        </>
    )
}

export default GpsCoordStr
