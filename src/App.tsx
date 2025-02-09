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
        element: <ProjectsListView />,
    },
    {
        path: `/app/:projectId`,
        element: <ProjectsEditView />,
    },
    {
        path: `/app/:projectId/workflows`,
        element: <ProjectsShowView />,
    },
    {
        path: `/app/:projectId/:workflowName`,
        element: <InstallationsListView />,
    },
    {
        path: `/app/:projectId/:workflowName/:jobId`,
        element: <InstallationsEditView />,
    },
    // {
    //     path: `/app/:projectId/:workflowName/:jobId/json`,
    //     element: (
    //         <Layout>
    //             <JsonStoreView />
    //         </Layout>
    //     ),
    // },
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
