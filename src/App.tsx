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
        path: `/app/:projectId/:workflowName/:installationId`,
        element: <InstallationsEditView />,
    },
])

type AppProps = Record<string, never>

const App: React.FC<AppProps> = () => {
    return (
        <DatabaseProvider>
            <RouterProvider router={router} />
        </DatabaseProvider>
    )
}

export default App
