import React, { useMemo } from 'react'
import { Button, Container, Image, Navbar } from 'react-bootstrap'
import { TfiAngleLeft } from 'react-icons/tfi'
import { Link, useLocation } from 'react-router-dom'

const RE_PATH: RegExp = /^\/(?:app\/([^\/]+)(?:\/([^\/]+)(?:\/([^\/]+))?)?)?$/i

function getBackPathname(pathname: string): string | undefined {
    const result = pathname.match(RE_PATH)

    if (result) {
        const [_pathname, projectId, workflowName, installationId] = result

        if (projectId) {
            if (workflowName) {
                if (workflowName === 'workflows') {
                    return '/'
                } else {
                    if (installationId) {
                        return `/app/${projectId}/${workflowName}`
                    } else {
                        return `/app/${projectId}/workflows`
                    }
                }
            } else {
                return '/'
            }
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation()

    const backPathname = useMemo<string | undefined>(() => {
        return getBackPathname(location.pathname)
    }, [location.pathname])

    return (
        <div id="root-background">
            <Navbar id="root-banner">
                {backPathname && (
                    <div id="back-button-container">
                        <Link to={backPathname} id="back-button-link">
                            <Button variant="outline-light" id="back-button">
                                <TfiAngleLeft id="back-button-logo" />
                            </Button>
                        </Link>
                    </div>
                )}
                <Container id="root-flex-layout">
                    <Navbar.Brand>
                        <span id="root-title">
                            {process.env.REACT_APP_NAME}
                        </span>
                    </Navbar.Brand>
                </Container>
                {backPathname && <div id="settings-button-container"></div>}
            </Navbar>
            <div id="root-body">{children}</div>
        </div>
    )
}

export default Layout
