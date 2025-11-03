import React, { useMemo, useEffect, useState } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import Footer from './footer'
import { TfiArrowLeft, TfiHome } from 'react-icons/tfi'
import { Link, useLocation, useParams, useMatches } from 'react-router-dom'
import ExportDoc from '../../projects/list/export_document'
import { useDatabase } from '../../../../providers/database_provider'
import { getProject } from '../../../../utilities/database_utils'
import { type Project } from '../../../../types/database.types'
import PATHS from '../../../../config/routes'

const RE_PATH = /^\/(?:app\/([^/]+)(?:\/([^/]+)(?:\/([^/]+))?)?)?$/i

function getBackPathname(pathname: string): string | undefined {
    const result = pathname.match(RE_PATH)

    if (result) {
        const [, projectId, workflowName, installationId] = result

        if (projectId) {
            if (workflowName) {
                if (workflowName === 'workflows') {
                    return PATHS.HOME
                } else {
                    if (installationId) {
                        return `${PATHS.APP_ROOT}/${projectId}/${workflowName}`
                    } else {
                        return `${PATHS.APP_ROOT}/${projectId}/workflows`
                    }
                }
            } else {
                return undefined
            }
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

const PageHeader: React.FC = () => {
    const location = useLocation()
    const params = useParams()
    const projectId = params.projectId
    const db = useDatabase()
    const [project, setProject] = useState<Project | null>(null)

    useEffect(() => {
        if (projectId) {
            getProject(db, projectId).then(doc => setProject(doc as Project))
        }
    }, [db, projectId])

    const matches = useMatches()
    const isHomePage = location.pathname === PATHS.HOME

    const getTitle = () => {
        const match = matches.find(
            m => (m.handle as { pageTitle?: string })?.pageTitle,
        )
        if (match) {
            return (match.handle as { pageTitle: string }).pageTitle
        }

        if (project) {
            return project.metadata_.doc_name
        }

        return process.env.REACT_APP_NAME
    }

    const backPathname = useMemo<string | undefined>(() => {
        if (
            location.pathname === PATHS.NEW_PROJECT ||
            location.pathname === `${PATHS.APP_ROOT}/${projectId}` ||
            location.pathname.includes('download-reminder')
        ) {
            return undefined
        }
        return getBackPathname(location.pathname)
    }, [location.pathname, projectId])

    const isFaqsPage = location.pathname === PATHS.FAQS

    return (
        <>
            <Navbar
                id="root-banner"
                className={isHomePage ? '' : 'reduced-height'}
            >
                <Container id="root-flex-layout">
                    <Navbar.Brand>
                        <span id="root-title">{getTitle()}</span>
                    </Navbar.Brand>
                </Container>
                {backPathname && (
                    <div
                        id="settings-button-container"
                        className="settings-button-container d-flex align-items-center"
                    >
                        {projectId &&
                            ![
                                PATHS.HOME,
                                PATHS.NEW_PROJECT,
                                `${PATHS.APP_ROOT}/${projectId}`,
                            ].includes(location.pathname) && (
                                <ExportDoc
                                    projectId={projectId}
                                    variant="outline-light"
                                />
                            )}
                    </div>
                )}
            </Navbar>
            {(backPathname || isFaqsPage) && (
                <Navbar
                    className={`navigation-bar ${
                        backPathname
                            ? 'justify-content-between'
                            : 'justify-content-end'
                    }`}
                >
                    {backPathname && (
                        <Link to={backPathname} id="back-button-link">
                            <Button id="back-button">
                                <TfiArrowLeft id="back-button-logo" />
                            </Button>
                        </Link>
                    )}
                    <Link to={PATHS.HOME} id="home-button-link">
                        <Button id="home-button">
                            <TfiHome id="home-button-logo" />
                        </Button>
                    </Link>
                </Navbar>
            )}
        </>
    )
}

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div id="root-background" className="layout-wrapper">
            <PageHeader />
            <div id="root-body">{children}</div>
            <Footer />
        </div>
    )
}

export default Layout
