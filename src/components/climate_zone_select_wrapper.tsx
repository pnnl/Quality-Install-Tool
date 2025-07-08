import React from 'react'

import SelectWrapper from './select_wrapper'
import { IECC_CLIMATE_ZONES } from '../types/iecc_climate_zone.type'

interface ClimateZoneSelectWrapperProps {
    label: React.ReactNode
    path: string
}

const ClimateZoneSelectWrapper: React.FC<ClimateZoneSelectWrapperProps> = ({
    label,
    path,
}) => {
    return (
        <SelectWrapper label={label} path={path} options={IECC_CLIMATE_ZONES} />
    )
}

export default ClimateZoneSelectWrapper
