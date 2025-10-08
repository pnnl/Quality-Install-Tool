import React, { useMemo, useEffect, useState } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import Footer from './footer'
import { TfiArrowLeft, TfiHome } from 'react-icons/tfi'
import { Link, useLocation, useParams } from 'react-router-dom'
import ExportDoc from '../../projects/list/export_document'
import { useDatabase } from '../../../../providers/database_provider'
import { getProject } from '../../../../utilities/database_utils'
import { type Project } from '../../../../types/database.types'

const RE_PATH = /^\/(?:app\/([^/]+)(?:\/([^/]+)(?:\/([^/]+))?)?)?$/i

function getBackPathname(pathname: string): string | undefined {
    const result = pathname.match(RE_PATH)

    if (result) {
        const [, projectId, workflowName, installationId] = result

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

    const isHomePage = location.pathname === '/'

    const getTitle = () => {
        if (location.pathname.endsWith('/workflows')) {
            return 'Choose Installation'
        }
        if (location.pathname === '/app/new') {
            return 'New Project'
        }
        if (location.pathname === `/app/${projectId}`) {
            return 'Edit Project'
        }
        if (location.pathname === '/faqs') {
            return 'FAQs'
        }
        if (project) {
            return project.metadata_.doc_name
        }
        return process.env.REACT_APP_NAME
    }

    const backPathname = useMemo<string | undefined>(() => {
        if (
            location.pathname === '/app/new' ||
            location.pathname === `/app/${projectId}` ||
            location.pathname.includes('/download-reminder')
        ) {
            return undefined
        }
        return getBackPathname(location.pathname)
    }, [location.pathname, projectId])

    const isFaqsPage = location.pathname === '/faqs'

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
                                '/',
                                '/app/project/new',
                                `/app/${projectId}`,
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
                    <Link to="/" id="home-button-link">
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
