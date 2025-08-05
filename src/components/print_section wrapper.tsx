import React from 'react'

import PrintSection from './print_section'

interface PrintSectionWrapperProps {
    title?: string
    label: React.ReactNode
    children: React.ReactNode
}

const PrintSectionWrapper: React.FC<PrintSectionWrapperProps> = ({
    title,
    label,
    children,
}) => {
    return (
        <PrintSection title={title} label={label}>
            {children}
        </PrintSection>
    )
}

export default PrintSectionWrapper
