import 'bootstrap/dist/css/bootstrap.css'
import {
    createBrowserRouter,
    RouterProvider,
    useLocation,
} from 'react-router-dom'
import './App.css'
import React, { Suspense, lazy, useEffect } from 'react'
import { initGA, logPageView } from './analytics'

// Lazily initializes the views, rendering them only when requested.
const RootLayout = lazy(() => import('./components/root_layout'))
const WorkFlowView = lazy(() => import('./components/workflow_view'))
const JobsView = lazy(() => import('./components/jobs_view'))
const Home = lazy(() => import('./components/home'))
const MdxProjectView = lazy(
    () => import('./components/mdx_project_details_view'),
)
const MdxTemplateView = lazy(() => import('./components/mdx_template_view'))
const MdxCombustionSafetyView = lazy(
    () => import('./components/mdx_combustion_appliance_safety_view'),
)

// Routes to be used by React Router, which handles all the
// browser routing within this domain.
const routes = [
    {
        path: '/',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <AnalyticsTracker />
                <RootLayout>
                    <Home />
                </RootLayout>
            </Suspense>
        ),
    },
    {
        path: `/app/:projectId/workflows`,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <AnalyticsTracker />
                <RootLayout>
                    <WorkFlowView />
                </RootLayout>
            </Suspense>
        ),
    },
    {
        path: `/app/:projectId/doe_combustion_appliance_safety_tests`,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <AnalyticsTracker />
                <RootLayout>
                    <MdxCombustionSafetyView />
                </RootLayout>
            </Suspense>
        ),
    },
    {
        path: `/app/:projectId`,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <AnalyticsTracker />
                <RootLayout>
                    <MdxProjectView />
                </RootLayout>
            </Suspense>
        ),
    },
    {
        path: `/app/:projectId/:workflowName`,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <AnalyticsTracker />
                <RootLayout>
                    <div>
                        <JobsView />
                    </div>
                </RootLayout>
            </Suspense>
        ),
    },
    {
        path: `/app/:projectId/:workflowName/:jobId`,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <RootLayout>
                    <MdxTemplateView />
                </RootLayout>
            </Suspense>
        ),
    },
]

const router = createBrowserRouter(routes)

function App(): any {
    // Move the location tracking logic to the child components, inside Router context
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

// Create a separate component to handle analytics, wrapped by the Router context
function AnalyticsTracker() {
    const location = useLocation()

    useEffect(() => {
        initGA() // Initialize Google Analytics on the first render
        logPageView() // Log initial page view

        // Listen for route changes using `useLocation` from React Router
    }, []) // Only run once on mount to initialize GA

    useEffect(() => {
        logPageView() // Log page view when the location changes (route changes)
    }, [location]) // Run this whenever the route/location changes

    return null // This component doesn't render anything
}

export default App
