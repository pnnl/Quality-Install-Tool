import 'bootstrap/dist/css/bootstrap.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import TemplateEditor from './components/editor'
import WorkFlowView from './components/workflow_view'
import JobsView from './components/jobs_view'
import JsonStoreView from './components/json_store_view'
import MdxTemplateView from './components/mdx_template_view'
import RootLayout from './components/root_layout'
import templatesConfig from './templates/templates_config'
import Home from './components/home'
import Projects from './templates/projects_config'
import MdxProjectView from './components/mdx_project_details_view'

// Routes to be used by React Router, which handles all the
// browser routing within this domain.

const routes = [
    {
        path: '/',
        element: (
            <RootLayout>
                <Home />
            </RootLayout>
        ),
    },

    {
        path: '/template_editor',
        element: <TemplateEditor />,
    },
]
    .concat(
        Projects.flatMap(key => [
            {
                path: `/app/${key?._id}/workflows`,
                element: (
                    <RootLayout>
                        <WorkFlowView project={key} />
                    </RootLayout>
                ),
            },
            {
                path: `/app/${key?._id}`,
                element: (
                    <RootLayout>
                        <MdxProjectView project={key} />
                    </RootLayout>
                ),
            },
        ]),
    )
    .concat(
        Projects.flatMap((project, value) =>
            Object.keys(templatesConfig).flatMap(workflowName => [
                {
                    path: `/app/${project?._id}/${workflowName}`,
                    // TODO: Create a component that provides the functionality
                    // to manage the documents in this DB
                    element: (
                        <RootLayout>
                            <div>
                                <JobsView
                                    workflowName={workflowName}
                                    projectID={project?._id}
                                />
                            </div>
                        </RootLayout>
                    ),
                },
                {
                    path: `/app/${project?._id}/${workflowName}/:docId`,
                    element: (
                        <RootLayout>
                            <MdxTemplateView
                                workflowName={workflowName}
                                project={project}
                            />
                        </RootLayout>
                    ),
                },
                {
                    path: `/app/${project?._id}/${workflowName}/:docId/json`,
                    element: (
                        <RootLayout>
                            <JsonStoreView
                                dbName={workflowName}
                                project={project}
                            />
                        </RootLayout>
                    ),
                },
            ]),
        ),
    )

// React Router
const router = createBrowserRouter(routes)

function App(): any {
    return <RouterProvider router={router} />
}

export default App
