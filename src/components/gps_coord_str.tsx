import {FC} from 'react'

import PhotoMetadata from '../types/photo_metadata.type'
import { loadPartialConfig } from '@babel/core'

/**
 * 
 * @param dec Geographic degrees 
 * @returns 
 */
const GpsCoordStr: FC<PhotoMetadata["geolocation"]> = (geolocation) => {
  const {latitude: lat, longitude: long} = geolocation
  return (
    <> {
     (lat  && lat.toString() !== 'NaN' && long  && long.toString() !== 'NaN') ?
      <span>{Number(lat).toFixed(4)}&deg;  {Number(long).toFixed(4)}&deg;</span> : <span>Missing</span>
        }
    </>
  )
}


export default GpsCoordStr