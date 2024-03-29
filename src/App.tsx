import 'bootstrap/dist/css/bootstrap.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
// TODO: This component will be revisited and revised in the future
//import TemplateEditor from './components/editor'
import WorkFlowView from './components/workflow_view'
import JobsView from './components/jobs_view'
// TODO: This component will be revisited and revised in the future
//import JsonStoreView from './components/json_store_view'
import MdxTemplateView from './components/mdx_template_view'
import RootLayout from './components/root_layout'
import templatesConfig from './templates/templates_config'
import Home from './components/home'
import MdxProjectView from './components/mdx_project_details_view'
import { retrieveProjects } from './utilities/database_utils'
import PouchDB from 'pouchdb'
import { useNavigate } from 'react-router-dom'

import dbName from './components/db_details'
import { FC, useEffect, useState } from 'react'

/**
 * App: Defines the routes to be used by React Router, which handles all the
 * browser routing within this domain.
 *
 */
const App: FC = () => {
    const db = new PouchDB(dbName)

    const [projectList, setProjectList] = useState<any[]>([])

    // Function to retrieve the updated project doc from PouchDB
    const retrieveProjectInfo = async (): Promise<void> => {
        //  Retrieving the document and updating the state variable accordingly
        retrieveProjects(db).then(res => {
            setProjectList(res)
        })
    }

    useEffect(() => {
        retrieveProjectInfo()
    }, [projectList]) // Trigger the effect when projectList changes

    // Generating the possible routes (both static and dynamic)
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
    ]
        .concat(
            projectList.flatMap(doc => [
                {
                    path: `/app/${doc?._id}/workflows`,
                    // Workflow list view:  List the names of workflows available for generating installation report.
                    element: (
                        <RootLayout>
                            <WorkFlowView project={doc} />
                        </RootLayout>
                    ),
                },
                {
                    path: `/app/${doc?._id}`,
                    // Project details view: Collects information related to the project.
                    element: (
                        <RootLayout>
                            <MdxProjectView project={doc} />
                        </RootLayout>
                    ),
                },
            ]),
        )
        .concat(
            projectList.flatMap((doc, value) =>
                Object.keys(templatesConfig).flatMap(workflowName => [
                    {
                        path: `/app/${doc?._id}/${workflowName}`,
                        // Jobs List View: Lists existing installations associated with a particular workflow
                        // and provides functionality to create new installations
                        element: (
                            <RootLayout>
                                <div>
                                    <JobsView
                                        workflowName={workflowName}
                                        docId={doc?._id}
                                    />
                                </div>
                            </RootLayout>
                        ),
                    },
                    {
                        // Jobs View: Gathering and displaying information pertinent to individual installations
                        path: `/app/${doc?._id}/${workflowName}/:jobId`,
                        element: (
                            <RootLayout>
                                <MdxTemplateView
                                    workflowName={workflowName}
                                    project={doc}
                                />
                            </RootLayout>
                        ),
                    },
                    // TODO: This route will be revisited and revised in the future
                    // {
                    //     path: `/app/${doc?._id}/${workflowName}/:jobId/json`,
                    //     element: (
                    //         <RootLayout>
                    //             <JsonStoreView
                    //                 dbName={workflowName}
                    //                 project={doc}
                    //             />
                    //         </RootLayout>
                    //     ),
                    // },
                ]),
            ),
        )

    // React Router
    const router = createBrowserRouter(routes, {
        basename: process.env.PUBLIC_URL,
    })

    return <RouterProvider router={router} />
}

export default App
