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
}

/**
 *
 * @param dec Geographic degrees
 * @returns
 */
const GpsCoordStr: FC<GpsCoordStrProps> = geolocation => {
    const { latitude, longitude, source } = geolocation
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
                    {source ? (
                        <span style={{ marginLeft: '2px' }}>
                            (source: {source})
                        </span>
                    ) : null}
                </>
            ) : (
                <span>Missing</span>
            )}
        </>
    )
}

export default GpsCoordStr
