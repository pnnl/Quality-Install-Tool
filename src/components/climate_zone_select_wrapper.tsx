import type { FC } from 'react'
import SelectWrapper from './select_wrapper'

const CLIMATE_ZONES = [
  '1A - Very Hot Humid',
  '1B - Very Hot Dry',
  '2A - Hot Humid',
  '2B - Hot Dry',
  '3A - Warm Humid',
  '3B - Warm Dry',
  '3C - Warm Marine',
  '4A - Mixed Humid',
  '4B - Mixed Dry',
  '4C - Mixed Marine',
  '5A - Cool Humid',
  '5B - Cool Dry',
  '5C - Cool Marine',
  '6A - Cold Humid',
  '6B - Cold Dry',
  '7 - Very Cold',
  '8 - Subarctic / Arctic'

]

interface ClimateZoneSelectWrapperProps {
  label: string
  path: string
}

/**
 * A component that *ultimately* wraps a Select component in order to tie it to the data store
 * and set its options to the IECC Climate Zones
 * @param label The label of the Select component
 * @param path The path (consistent with the path provided to the lodash
 * get() method) to the datum within the data store for the Select component
 */
const ClimateZoneSelectWrapper: FC<ClimateZoneSelectWrapperProps> = ({ label, path }) => {
  return <SelectWrapper label={label} options={CLIMATE_ZONES} path={path} />
}

export default ClimateZoneSelectWrapper
