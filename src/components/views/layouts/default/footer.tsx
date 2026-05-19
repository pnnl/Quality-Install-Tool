import React, { useEffect, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { useAppVersion } from '../../../../hooks/useAppVersion'
import PATHS from '../../../../config/routes'
import { getBrowserStorageUsageDetails } from '../../../../utilities/storage_error_utils'

const Footer: React.FC = () => {
    const { lastUpdated } = useAppVersion() || new Date().toISOString()
    const [storageUsageText, setStorageUsageText] = useState<string>(
        'Browser Storage Used: unavailable',
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

        const intervalId = window.setInterval(updateStorageUsage, 15000)

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                updateStorageUsage()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            isActive = false
            window.clearInterval(intervalId)
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            )
        }
    }, [])

    return (
        <Navbar bg="light" variant="light" className="footer">
            <Container>
                <div className="d-flex justify-content-between w-100 align-items-center">
                    <Nav>
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
                            className="footer-nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {`Contact Us: ${process.env.REACT_APP_CONTACT_EMAIL}`}
                        </Nav.Link>
                    </Nav>
                    <div className="d-flex flex-column align-items-end footer-status-group">
                        <span className="navbar-text footer-navbar-text">
                            {storageUsageText}
                        </span>
                        {storageUsagePercent !== undefined &&
                            storageUsagePercent >= 0.1 && (
                                <span className="navbar-text footer-navbar-text footer-storage-warning">
                                    <span
                                        className="footer-storage-warning-icon"
                                        aria-hidden="true"
                                    >
                                        !
                                    </span>{' '}
                                    Near browser storage limit.{' '}
                                    <Nav.Link
                                        href={`${PATHS.FAQS}#browser-storage`}
                                        className="footer-storage-warning-link"
                                    >
                                        See FAQs
                                    </Nav.Link>
                                </span>
                            )}
                        <span className="navbar-text footer-navbar-text">
                            App Last Updated:{' '}
                            {lastUpdated || new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </Container>
        </Navbar>
    )
}

export default Footer
