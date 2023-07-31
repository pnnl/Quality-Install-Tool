import { FC, useEffect, useState } from 'react'
import { TfiAngleLeft } from 'react-icons/tfi'

import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import NavBar from 'react-bootstrap/NavBar'
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
        const regexPatternToTemplate = /^.*?\/app\/([^\/]+)\/([^\/]+)$/
        const toTemplateMatchResult = location.pathname.match(
            regexPatternToTemplate,
        )
        if (toTemplateMatchResult) {
            setShowBackButton(true)
            const [, capturedTemplateName] = toTemplateMatchResult
            setBackUrl('/app/' + capturedTemplateName)
        } else if (regexPatternToHome.test(location.pathname)) {
            setShowBackButton(true)
            setBackUrl('/')
        } else {
            setShowBackButton(false)
        }
    }, [location.pathname])

    return (
        <div id="root-background">
            <NavBar id="root-banner">
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
                    <NavBar.Brand>
                        <span id="root-title">Quality Install Tool</span>
                    </NavBar.Brand>
                </Container>
            </NavBar>
            <div id="root-body">{children}</div>
        </div>
    )
}

export default RootLayout