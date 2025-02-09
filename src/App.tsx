import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css'

import './App.css'

import InstallationsEditView from './components/views/installations/edit'
import InstallationsListView from './components/views/installations/list'

import ProjectsEditView from './components/views/projects/edit'
import ProjectsListView from './components/views/projects/list'
import ProjectsShowView from './components/views/projects/show'

import DatabaseProvider from './providers/database_provider'

const router = createBrowserRouter([
    {
        path: '/',
        // App Home page : Lists existing projects provides functionality to create new one
        element: <ProjectsListView />,
    },
    {
        path: `/app/:projectId`,
        // Project details view: Collects information related to the project.
        element: <ProjectsEditView />,
    },
    {
        path: `/app/:projectId/workflows`,
        // Workflow list view:  List the names of workflows available for generating installation report.
        element: <ProjectsShowView />,
    },
    {
        path: `/app/:projectId/:workflowName`,
        // Jobs List View: Lists existing installations associated with a particular workflow
        // and provides functionality to create new installations
        element: <InstallationsListView />,
    },
    {
        path: `/app/:projectId/:workflowName/:jobId`,
        // Jobs View: Gathering and displaying information pertinent to individual installations
        element: <InstallationsEditView />,
    },
    // TODO: This route will be revisited and revised in the future
    // {
    //     path: `/app/:projectId/:workflowName/:jobId/json`,
    //     element: (
    //         <Layout>
    //             <JsonStoreView />
    //         </Layout>
    //     ),
    // },
    // TODO: This route will be revisited and revised in the future
    // {
    //     path: '/template_editor',
    //     element: <TemplateEditor />,
    // },
])

const App: React.FC = () => {
    return (
        <DatabaseProvider>
            <RouterProvider router={router} />
        </DatabaseProvider>
    )
}

export default App
