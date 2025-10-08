import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { useAppVersion } from '../../../../hooks/useAppVersion'

const Footer: React.FC = () => {
    const { lastUpdated } = useAppVersion() || new Date().toISOString()

    return (
        <Navbar bg="light" variant="light" className="footer">
            <Container>
                <div className="d-flex justify-content-between w-100 align-items-center">
                    <Nav>
                        <Nav.Link
                            href="https://www.pnnl.gov/projects/quality-install-tool"
                            className="footer-nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            About the Tool
                        </Nav.Link>
                        <Nav.Link
                            href="mailto:QItool@pnnl.gov"
                            className="footer-nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Contact Us
                        </Nav.Link>
                        <Nav.Link href="/faqs" className="footer-nav-link">
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
