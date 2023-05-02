import {FC} from 'react'

import DegMinSecCRef from '../types/deg_min_sec_cref.type'

/**
 * 
 * @param degrees Geographic degrees
 * @param minutes Geographic minutes
 * @param seconds Geographic seconds
 * @param cRef Geographic reference direction (N, S, E, W)
 * @returns 
 */
const GpsCoordStr: FC<DegMinSecCRef> = ({deg, min, sec, cRef}) => {
  return (
    <>
      <span>{String(deg)}&deg;</span>
      <span>{String(min)}&prime;</span>
      <span>{String(sec)}&Prime;</span>
      <span>{cRef}</span>
    </>
  )
}

export default GpsCoordStr