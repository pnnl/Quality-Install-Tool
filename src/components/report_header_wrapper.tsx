import React from 'react'

import ReportHeader from './report_header'

interface ReportHeaderWrapperProps {
    title: string
    docName?: string
    subtitle?: string
}

const ReportHeaderWrapper: React.FC<ReportHeaderWrapperProps> = ({
    title,
    docName,
    subtitle,
}) => {
    return <ReportHeader title={title} docName={docName} subtitle={subtitle} />
}

export default ReportHeaderWrapper
