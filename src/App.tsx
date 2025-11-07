import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css'

import './App.css'

import InstallationsEditView from './components/views/installations/edit'
import InstallationsListView from './components/views/installations/list'

import ProjectsEditView from './components/views/projects/edit'
import ProjectsListView from './components/views/projects/list'
import ProjectsNewView from './components/views/projects/new'
import ProjectsShowView from './components/views/projects/show'
import DownloadReminderPage from './components/views/shared/download_reminder_page'
import FaqsPage from './components/views/faqs'

import DatabaseProvider from './providers/database_provider'
import PATHS from './config/routes'

const router = createBrowserRouter(
    [
        {
            path: PATHS.HOME,
            element: <ProjectsListView />,
            handle: { pageTitle: process.env.REACT_APP_NAME },
        },
        {
            path: PATHS.EDIT_PROJECT,
            element: <ProjectsEditView />,
            handle: { pageTitle: 'Edit Project' },
        },
        {
            path: PATHS.NEW_PROJECT,
            element: <ProjectsNewView />,
            handle: { pageTitle: 'New Project' },
        },
        {
            path: PATHS.SHOW_PROJECT,
            element: <ProjectsShowView />,
            handle: { pageTitle: 'Choose Installation' },
        },
        {
            path: PATHS.INSTALLATIONS_LIST,
            element: <InstallationsListView />,
        },
        {
            path: PATHS.EDIT_INSTALLATION,
            element: <InstallationsEditView />,
        },
        {
            path: PATHS.DOWNLOAD_REMINDER,
            element: <DownloadReminderPage />,
        },
        {
            path: PATHS.FAQS,
            element: <FaqsPage />,
            handle: { pageTitle: 'FAQs' },
        },
    ],
    {
        future: {
            v7_relativeSplatPath: true,
        },
    },
)

type AppProps = Record<string, never>

const App: React.FC<AppProps> = () => {
    return (
        <DatabaseProvider>
            <RouterProvider
                future={{
                    v7_startTransition: true,
                }}
                router={router}
            />
        </DatabaseProvider>
    )
}

export default App
