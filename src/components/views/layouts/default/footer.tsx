import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { useAppVersion } from '../../../../hooks/useAppVersion'
import PATHS from '../../../../config/routes'

const Footer: React.FC = () => {
    const { lastUpdated } = useAppVersion() || new Date().toISOString()

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
                        <Nav.Link
                            href={`mailto:${process.env.REACT_APP_CONTACT_EMAIL}`}
                            className="footer-nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Contact Us
                        </Nav.Link>
                        <Nav.Link href={PATHS.FAQS} className="footer-nav-link">
                            FAQs
                        </Nav.Link>
                    </Nav>
                    <span className="navbar-text footer-navbar-text">
                        App Last Updated:{' '}
                        {lastUpdated || new Date().toLocaleDateString()}
                    </span>
                </div>
            </Container>
        </Navbar>
    )
}

export default Footer
