import PouchDB from 'pouchdb'
import React, { Suspense, lazy } from 'react'
import {
    RouterProvider,
    createBrowserRouter,
    useParams,
} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css'

import './App.css'

import DatabaseProvider from './providers/database_provider'
import InstallationProvider from './providers/installation_provider'
import InstallationsProvider, {
    type InstallationDocument,
} from './providers/installations_provider'
import ProjectProvider from './providers/project_provider'
import ProjectsProvider, {
    type ProjectDocument,
} from './providers/projects_provider'
import WorkflowProvider from './providers/workflow_provider'
import templatesConfig from './templates/templates_config'
import { comparator } from './utilities/comparison_utils'

const Home = lazy(() => import('./components/home'))
const JobsView = lazy(() => import('./components/jobs_view'))
const MdxCombustionSafetyView = lazy(
    () => import('./components/mdx_combustion_appliance_safety_view'),
)
const MdxProjectView = lazy(
    () => import('./components/mdx_project_details_view'),
)
const MdxTemplateView = lazy(() => import('./components/mdx_template_view'))
const RootLayout = lazy(() => import('./components/root_layout'))
const WorkflowView = lazy(() => import('./components/workflow_view'))

const InstallationsIndex: React.FC = () => {
    const { projectId } = useParams<{
        projectId: PouchDB.Core.DocumentId
    }>()

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RootLayout>
                <ProjectProvider projectId={projectId}>
                    <InstallationsProvider projectId={projectId}>
                        <WorkflowView />
                    </InstallationsProvider>
                </ProjectProvider>
            </RootLayout>
        </Suspense>
    )
}

const InstallationsIndexByWorkflow: React.FC = () => {
    const { projectId, workflowName } = useParams<{
        projectId: PouchDB.Core.DocumentId
        workflowName: keyof typeof templatesConfig
    }>()

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RootLayout>
                <ProjectProvider projectId={projectId}>
                    <WorkflowProvider workflowName={workflowName}>
                        {workflowName ===
                        'doe_combustion_appliance_safety_tests' ? (
                            <MdxCombustionSafetyView />
                        ) : (
                            <InstallationsProvider
                                projectId={projectId}
                                workflowName={workflowName}
                                installationComparator={comparator<InstallationDocument>(
                                    'last_modified_at',
                                    'desc',
                                )}
                            >
                                <JobsView workflowName={workflowName} />
                            </InstallationsProvider>
                        )}
                    </WorkflowProvider>
                </ProjectProvider>
            </RootLayout>
        </Suspense>
    )
}

const InstallationsShow: React.FC = () => {
    const { projectId, workflowName, jobId } = useParams<{
        projectId: PouchDB.Core.DocumentId
        workflowName: keyof typeof templatesConfig
        jobId: PouchDB.Core.DocumentId
    }>()

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RootLayout>
                <ProjectProvider projectId={projectId}>
                    <WorkflowProvider workflowName={workflowName}>
                        <InstallationProvider installationId={jobId}>
                            <MdxTemplateView />
                        </InstallationProvider>
                    </WorkflowProvider>
                </ProjectProvider>
            </RootLayout>
        </Suspense>
    )
}

const ProjectsIndex: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RootLayout>
                <ProjectsProvider
                    projectComparator={comparator<ProjectDocument>(
                        'last_modified_at',
                        'desc',
                    )}
                >
                    <Home />
                </ProjectsProvider>
            </RootLayout>
        </Suspense>
    )
}

const ProjectsShow: React.FC = () => {
    const { projectId } = useParams<{
        projectId: PouchDB.Core.DocumentId
    }>()

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RootLayout>
                <ProjectProvider projectId={projectId}>
                    <MdxProjectView />
                </ProjectProvider>
            </RootLayout>
        </Suspense>
    )
}

const router = createBrowserRouter([
    {
        path: '/',
        // App Home page : Lists existing projects provides functionality to create new one
        element: <ProjectsIndex />,
    },
    {
        path: `/app/:projectId`,
        // Project details view: Collects information related to the project.
        element: <ProjectsShow />,
    },
    {
        path: `/app/:projectId/workflows`,
        // Workflow list view:  List the names of workflows available for generating installation report.
        element: <InstallationsIndex />,
    },
    {
        path: `/app/:projectId/:workflowName`,
        // Jobs List View: Lists existing installations associated with a particular workflow
        // and provides functionality to create new installations
        element: <InstallationsIndexByWorkflow />,
    },
    {
        path: `/app/:projectId/:workflowName/:jobId`,
        // Jobs View: Gathering and displaying information pertinent to individual installations
        element: <InstallationsShow />,
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
