import React, { FC } from 'react'

import { StoreContext } from './store'
import PrintSection from './print_section'
import { useParams } from 'react-router-dom'
import templatesConfig from '../templates/templates_config'

interface PrintSectionWrapperProps {
    children: React.ReactNode
    label: string
    measureName: string
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
    const { workflowName, jobId } = useParams<{
        workflowName: string
        jobId: string
    }>()

    const measureName =
        templatesConfig[workflowName!]?.title ||
        workflowName ||
        'Unknown Measure'

    // Generate an id for the input
    return (
        <StoreContext.Consumer>
            {({ metadata }) => {
                return (
                    <PrintSection
                        children={children}
                        label={label}
                        measureName={measureName}
                        jobId={jobId}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default PrintSectionWrapper
