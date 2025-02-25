import React, { useCallback } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import { TfiAngleLeft } from 'react-icons/tfi'
import { useLocation, useNavigate } from 'react-router-dom'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation()

    const navigate = useNavigate()

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            navigate(-1)

            return false
        },
        [navigate],
    )

    return (
        <div id="root-background">
            <Navbar id="root-banner">
                {location.pathname !== '/' && (
                    <div id="back-button-container">
                        <Button
                            variant="outline-light"
                            id="back-button"
                            onClick={handleClick}
                        >
                            <TfiAngleLeft id="back-button-logo" />
                        </Button>
                    </div>
                )}
                <Container id="root-flex-layout">
                    <Navbar.Brand>
                        <span id="root-title">
                            {process.env.REACT_APP_NAME}
                        </span>
                    </Navbar.Brand>
                </Container>
                {location.pathname !== '/' && (
                    <div id="settings-button-container"></div>
                )}
            </Navbar>
            <div id="root-body">{children}</div>
        </div>
    )
}

export default Layout
