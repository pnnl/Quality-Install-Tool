import React, { useEffect, useState } from 'react'
import { Container, Nav, Navbar, ProgressBar } from 'react-bootstrap'
import { useAppVersion } from '../../../../hooks/useAppVersion'
import PATHS from '../../../../config/routes'
import { getBrowserStorageUsageDetails } from '../../../../utilities/storage_error_utils'

const getStorageVariant = (percent: number): string => {
    if (percent >= 90) return 'danger'
    if (percent >= 75) return 'warning'
    return 'success'
}

const formatDate = (dateStr: string | null): string => {
    const d = dateStr ? new Date(dateStr) : new Date()
    if (isNaN(d.getTime())) return dateStr ?? ''
    return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })
}

const Footer: React.FC = () => {
    const { lastUpdated } = useAppVersion() || new Date().toISOString()
    const [storageUsageText, setStorageUsageText] = useState<string>(
        'Browser Storage Used: NA',
    )
    const [storageUsagePercent, setStorageUsagePercent] = useState<
        number | undefined
    >(undefined)

    useEffect(() => {
        let isActive = true

        const updateStorageUsage = async () => {
            const usageDetails = await getBrowserStorageUsageDetails()

            if (isActive) {
                setStorageUsageText(usageDetails.text)
                setStorageUsagePercent(usageDetails.percent)
            }
        }

        updateStorageUsage()

        const intervalId = setInterval(updateStorageUsage, 15000)

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                updateStorageUsage()
            }
        }

        const handleCompacted = () => {
            updateStorageUsage()
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('pouchdb-compacted', handleCompacted)

        return () => {
            isActive = false
            clearInterval(intervalId)
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            )
            window.removeEventListener('pouchdb-compacted', handleCompacted)
        }
    }, [])

    return (
        <Navbar bg="light" variant="light" className="footer">
            <Container>
                <div className="d-flex flex-column flex-sm-row justify-content-between w-100 align-items-sm-center gap-1">
                    <Nav className="flex-wrap footer-links-nav">
                        <Nav.Link
                            href={process.env.REACT_APP_HOMEPAGE}
                            className="footer-nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            About the Tool
                        </Nav.Link>
                        <Nav.Link href={PATHS.FAQS} className="footer-nav-link">
                            FAQs
                        </Nav.Link>
                        <Nav.Link
                            href={`mailto:${process.env.REACT_APP_CONTACT_EMAIL}`}
                            className="footer-nav-link d-none d-sm-inline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {`Contact Us: ${process.env.REACT_APP_CONTACT_EMAIL}`}
                        </Nav.Link>
                        <Nav.Link
                            href={`mailto:${process.env.REACT_APP_CONTACT_EMAIL}`}
                            className="footer-nav-link d-inline d-sm-none"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Contact Us
                        </Nav.Link>
                    </Nav>
                    <div className="d-flex flex-row align-items-center justify-content-start justify-content-sm-end footer-status-group">
                        <div className="footer-storage-meter me-3">
                            <div className="footer-storage-label">
                                Storage{' '}
                                {storageUsagePercent !== undefined
                                    ? `${storageUsagePercent.toFixed(2)}%`
                                    : 'N/A'}
                                {storageUsagePercent !== undefined &&
                                    storageUsagePercent >= 50 && (
                                        <Nav.Link
                                            href={`${PATHS.FAQS}#browser-storage`}
                                            className="footer-storage-warning-link ms-1"
                                            title="Near browser storage limit — see FAQs"
                                        >
                                            ⚠ See FAQs
                                        </Nav.Link>
                                    )}
                            </div>
                            {storageUsagePercent !== undefined ? (
                                <ProgressBar
                                    now={storageUsagePercent}
                                    variant={getStorageVariant(
                                        storageUsagePercent,
                                    )}
                                    className="footer-storage-bar"
                                    aria-label={storageUsageText}
                                />
                            ) : (
                                <ProgressBar
                                    now={0}
                                    variant="secondary"
                                    className="footer-storage-bar"
                                    aria-label="Storage usage unavailable"
                                />
                            )}
                        </div>
                        <span className="navbar-text footer-navbar-text footer-last-updated">
                            <span
                                className="footer-last-updated-icon"
                                aria-hidden="true"
                            >
                                🗓
                            </span>{' '}
                            Updated {formatDate(lastUpdated)}
                        </span>
                    </div>
                </div>
            </Container>
        </Navbar>
    )
}

export default Footer
