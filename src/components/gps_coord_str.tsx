import {FC} from 'react'

import PhotoMetadata from '../types/photo_metadata.type'
import { loadPartialConfig } from '@babel/core'

/**
 * 
 * @param dec Geographic degrees 
 * @returns 
 */
const GpsCoordStr: FC<PhotoMetadata["geolocation"]> = (geolocation) => {
  const {latitude, longitude} = geolocation
  const geoStr = latitude && longitude ? Number(latitude).toFixed(4) + "," + Number(longitude).toFixed(4) : null
  
  return (
    <> 
      {geoStr ? <a href={"https://www.google.com/maps/search/?api=1&query=" + geoStr} target="_blank">{geoStr}</a> : <span>Missing</span>}
    </>
  )
}


export default GpsCoordStr