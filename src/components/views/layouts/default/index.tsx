import React, { useMemo } from 'react'
import { Button, Container, Image, Navbar } from 'react-bootstrap'
import { TfiAngleLeft } from 'react-icons/tfi'
import { Link, useLocation } from 'react-router-dom'

const TITLE: string = 'Quality Install Tool'

// @todo Refactor {RegExp} objects into top-level constants.
// @todo Optimize implementation of {getBackPathname} function.
function getBackPathname(pathname: string): string | undefined {
    const regexPatternToHome = /^(.*?)\/app\//
    const regexPatternToProjectDetails = /^.*?\/app\/([^\/]+)$/
    const regexPatternToWorkFlow = /^.*?\/app\/([^\/]+)\/([^\/]+)$/
    const regexPatternToTemplate = /^.*?\/app\/([^\/]+)\/([^\/]+)\/([^\/]+)$/

    const toTemplateMatchResult = pathname.match(regexPatternToTemplate)
    const toWorkFlowMatchResult = pathname.match(regexPatternToWorkFlow)
    const toProjectDetailsMatchResult = pathname.match(
        regexPatternToProjectDetails,
    )

    if (toProjectDetailsMatchResult) {
        return undefined
    } else if (toWorkFlowMatchResult) {
        const [, capturedTemplateName, workflowName] = toWorkFlowMatchResult

        if (workflowName == 'workflows') {
            return '/'
        } else {
            return `/app/${capturedTemplateName}/workflows`
        }
    } else if (toTemplateMatchResult) {
        const [, capturedTemplateName, workflowName] = toTemplateMatchResult

        return `/app/${capturedTemplateName}/${workflowName}`
    } else if (regexPatternToHome.test(pathname)) {
        return '/'
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
                        <span id="root-title">{TITLE}</span>
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <div id="root-body">{children}</div>
        </div>
    )
}

export default Layout
