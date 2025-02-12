import React from 'react'

import PrintSection from './print_section'

interface PrintSectionWrapperProps {
    children: React.ReactNode
    label: React.ReactNode
}

const PrintSectionWrapper: React.FC<PrintSectionWrapperProps> = ({
    children,
    label,
}) => {
    return <PrintSection children={children} label={label} />
}

export default PrintSectionWrapper
