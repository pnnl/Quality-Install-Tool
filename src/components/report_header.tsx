import React from 'react'

export interface ReportHeaderProps {
    title: string
    docName?: string
    subtitle?: string
}

export default function ReportHeader({
    title,
    docName,
    subtitle,
}: ReportHeaderProps) {
    return (
        <div className="report-header-container">
            <h1>{title}</h1>
            {docName && <div className="report-header-docname">{docName}</div>}
            {subtitle && <h2 className="report-header-subtitle">{subtitle}</h2>}
        </div>
    )
}
