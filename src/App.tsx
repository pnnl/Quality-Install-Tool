import 'bootstrap/dist/css/bootstrap.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import TemplateEditor from './components/editor'
import WorkFlowView from './components/workflow_view'
import JobsView from './components/jobs_view'
import JsonStoreView from './components/json_store_view'
import MdxTemplateView from './components/mdx_template_view'
import RootLayout from './components/root_layout'
import Home from './components/home'
import MdxProjectView from './components/mdx_project_details_view'
import MdxCombustionSafetyView from './components/mdx_combustion_appliance_safety_view'

// Routes to be used by React Router, which handles all the
// browser routing within this domain.

const routes = [
    {
        path: '/',
        // App Home page : Lists existing projects provides functionality to create new one
        element: (
            <RootLayout>
                <Home />
            </RootLayout>
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
            <RootLayout>
                <WorkFlowView />
            </RootLayout>
        ),
    },
    {
        path: `/app/:projectId/doe_workflow_combustion_safety_testing`,
        // Workflow list view:  List the names of workflows available for generating installation report.
        element: (
            <RootLayout>
                <MdxCombustionSafetyView />
            </RootLayout>
        ),
    },
    {
        path: `/app/:projectId`,
        // Project details view: Collects information related to the project.
        element: (
            <RootLayout>
                <MdxProjectView />
            </RootLayout>
        ),
    },
    {
        path: `/app/:projectId/:workflowName`,
        // Jobs List View: Lists existing installations associated with a particular workflow
        // and provides functionality to create new installations
        element: (
            <RootLayout>
                <div>
                    <JobsView />
                </div>
            </RootLayout>
        ),
    },
    {
        path: `/app/:projectId/:workflowName/:jobId`,
        // Jobs View: Gathering and displaying information pertinent to individual installations
        element: (
            <RootLayout>
                <MdxTemplateView />
            </RootLayout>
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

function App(): any {
    return <RouterProvider router={router} />
}

export default App
