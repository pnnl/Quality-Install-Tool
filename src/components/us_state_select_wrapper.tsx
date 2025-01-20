import React, { FC } from 'react'

import SelectWrapper from './select_wrapper'

export const US_STATES = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'District of Columbia',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
]

interface USStateSelectWrapperProps {
    label: string
    path: string
}

/**
 * A component that *ultimately* wraps a Select component in order to tie it to the data store
 * and set its options to the 50 U.S. states
 *
 * @param label The label of the Select component
 * @param path The path (consistent with the path provided to the lodash
 * get() method) to the datum within the data store for the Select component
 */
const USStateSelectWrapper: FC<USStateSelectWrapperProps> = ({
    label,
    path,
}) => {
    return <SelectWrapper label={label} options={US_STATES} path={path} />
}

export default USStateSelectWrapper
