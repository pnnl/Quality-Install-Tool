import React, { FC } from 'react'

import { StoreContext } from './store'
import PrintSection from './print_section'

interface PrintSectionWrapperProps {
    children: React.ReactNode
    label: string
}

/**
 * A component that wraps a PrintSection component in order to tie it to the data store
 *
 * @param children Content (most commonly markdown text) to be passed on as the PhotInput
 * children
 * @param label The button label of the PrintSection component
 */
const PrintSectionWrapper: FC<PrintSectionWrapperProps> = ({
    children,
    label,
}) => {
    // Generate an id for the input
    return (
        <StoreContext.Consumer>
            {({ metadata }) => {
                return <PrintSection children={children} label={label} />
            }}
        </StoreContext.Consumer>
    )
}

export default PrintSectionWrapper
