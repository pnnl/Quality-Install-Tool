import 'bootstrap/dist/css/bootstrap.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

import TemplateEditor from './components/editor'
import Home from './components/home'
import JobsView from './components/jobs_view'
import JsonStoreView from './components/json_store_view'
import MdxTemplateView from './components/mdx_template_view'
import RootLayout from './components/root_layout'
import templatesConfig from './templates/templates_config'

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
].concat(
    Object.keys(templatesConfig).flatMap(dbName => [
        {
            path: `/app/${dbName}`,
            // TODO: Create a component that provides the functionality
            // to manage the documents in this DB
            element: (
                <RootLayout>
                    <div>
                        <JobsView dbName={dbName} />
                    </div>
                </RootLayout>
            ),
        },
        {
            path: `/app/${dbName}/:docId`,
            element: (
                <RootLayout>
                    <MdxTemplateView dbName={dbName} />
                </RootLayout>
            ),
        },
        {
            path: `/app/${dbName}/:docId/json`,
            element: (
                <RootLayout>
                    <JsonStoreView dbName={dbName} />
                </RootLayout>
            ),
        },
    ]),
)

// React Router
const router = createBrowserRouter(routes)

function App(): any {
    return <RouterProvider router={router} />
}

export default App
