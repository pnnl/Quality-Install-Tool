import {FC} from 'react'

import GpsDecimalDeg from '../types/gps_decimal_degrees.type'

/**
 * 
 * @param dec Geographic degrees 
 * @returns 
 */
const GpsCoordStr: FC<GpsDecimalDeg> = ({dec}) => {
  
  return (
    <>
      <span>{Number(dec).toFixed(4)}&deg;</span>
    </>
  )
}

export default GpsCoordStr