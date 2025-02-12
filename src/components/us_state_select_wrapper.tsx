import React from 'react'

import SelectWrapper from './select_wrapper'
import { US_STATES } from '../types/us_state.type'

interface USStateSelectWrapperProps {
    label: React.ReactNode
    path: string
}

const USStateSelectWrapper: React.FC<USStateSelectWrapperProps> = ({
    label,
    path,
}) => {
    return <SelectWrapper options={US_STATES} label={label} path={path} />
}

export default USStateSelectWrapper
