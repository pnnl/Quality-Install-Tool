import { FC, useEffect, useState } from 'react'
import { TfiAngleLeft } from 'react-icons/tfi'

import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Navbar from 'react-bootstrap/Navbar'
import { useLocation, Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

interface RootLayoutProps {
    children: React.ReactNode
}

/**
 * The highest-level visible component for the app
 *
 * @param children The content for the app
 *
 * @remarks
 * Provides a banner that includes a menu
 */

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    const location = useLocation()

    // templateName set to anything other than the empty string while showBackButton is true indicates that the
    // back button should send the user to the JobsView. templateName set to the empty string while
    // showBackButton is true indicates that the back button should send the user to the Home screen.
    const [showBackButton, setShowBackButton] = useState(false)
    const [backUrl, setBackUrl] = useState('/')

    useEffect(() => {
        const regexPatternToHome = /^(.*?)\/app\//
        const regexPatternToProjectDetails = /^.*?\/app\/([^\/]+)$/
        const regexPatternToWorkFlow = /^.*?\/app\/([^\/]+)\/([^\/]+)$/
        const regexPatternToTemplate =
            /^.*?\/app\/([^\/]+)\/([^\/]+)\/([^\/]+)$/
        const toTemplateMatchResult = location.pathname.match(
            regexPatternToTemplate,
        )

        const toWorkFlowMatchResult = location.pathname.match(
            regexPatternToWorkFlow,
        )
        const toProjectDetailsMatchResult = location.pathname.match(
            regexPatternToProjectDetails,
        )

        if (toProjectDetailsMatchResult) setShowBackButton(false)
        else if (toWorkFlowMatchResult) {
            setShowBackButton(true)
            const [, capturedTemplateName, workflowName] = toWorkFlowMatchResult
            if (workflowName == 'workflows') setBackUrl('/')
            else setBackUrl('/app/' + capturedTemplateName + '/workflows')
        } else if (toTemplateMatchResult) {
            setShowBackButton(true)
            const [, capturedTemplateName, workflowName] = toTemplateMatchResult
            setBackUrl('/app/' + capturedTemplateName + '/' + workflowName)
        } else if (regexPatternToHome.test(location.pathname)) {
            setShowBackButton(true)
            setBackUrl('/')
        } else {
            setShowBackButton(false)
        }
    }, [location.pathname])

    /**
     * The title of the application
     */
    const app_title = 'TEST - Quality Install Tool'

    return (
        <div id="root-background">
            <Navbar id="root-banner">
                {/* Conditional rendering of a back button */}
                {showBackButton && (
                    <div id="back-button-container">
                        <Link to={backUrl} id="back-button-link">
                            <Button variant="outline-light" id="back-button">
                                <TfiAngleLeft id="back-button-logo" />
                            </Button>
                        </Link>
                    </div>
                )}
                <Container id="root-flex-layout">
                    <Navbar.Brand>
                        <span id="root-title">{app_title}</span>
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <div id="root-body">{children}</div>
        </div>
    )
}

export default RootLayout
