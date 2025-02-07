import React, { Suspense, lazy } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css'

import './App.css'

// Lazily initializes the views, rendering them only when requested.
const RootLayout = lazy(() => import('./components/root_layout'))
const WorkflowView = lazy(() => import('./components/workflow_view'))
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

/**
 * Wraps the application in a <Suspense> component to handle loading states.
 *
 * The `fallback` prop displays a loading indicator while the child components
 * are being loaded asynchronously.
 */
const routes = [
    {
        path: '/',
        // App Home page : Lists existing projects provides functionality to create new one
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <RootLayout>
                    <Home />
                </RootLayout>
            </Suspense>
        ),
    },
    // TODO: This route will be revisited and revised in the future
    // {
    //     path: '/template_editor',
    //     element: <TemplateEditor />,
    // },
    {
        path: `/app/:projectId/workflows`,
        // Workflow list view:  List the names of workflows available for generating installation report.
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <RootLayout>
                    <WorkflowView />
                </RootLayout>
            </Suspense>
        ),
    },
    {
        path: `/app/:projectId/doe_combustion_appliance_safety_tests`,
        // Workflow list view:  List the names of workflows available for generating installation report.
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <RootLayout>
                    <MdxCombustionSafetyView />
                </RootLayout>
            </Suspense>
        ),
    },
    {
        path: `/app/:projectId`,
        // Project details view: Collects information related to the project.
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <RootLayout>
                    <MdxProjectView />
                </RootLayout>
            </Suspense>
        ),
    },
    {
        path: `/app/:projectId/:workflowName`,
        // Jobs List View: Lists existing installations associated with a particular workflow
        // and provides functionality to create new installations
        element: (
            <Suspense fallback={<div>Loading...</div>}>
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
        // Jobs View: Gathering and displaying information pertinent to individual installations
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <RootLayout>
                    <MdxTemplateView />
                </RootLayout>
            </Suspense>
        ),
    },
    // TODO: This route will be revisited and revised in the future
    // {
    //     path: `/app/:projectId/:workflowName/:jobId/json`,
    //     element: (
    //         <RootLayout>
    //             <JsonStoreView />
    //         </RootLayout>
    //     ),
    // },
]

// React Router
const router = createBrowserRouter(routes)

interface AppProps {}

const App: React.FC<AppProps> = () => {
    return <RouterProvider router={router} />
}

export default App
