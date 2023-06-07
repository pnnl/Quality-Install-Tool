import "bootstrap/dist/css/bootstrap.css";
import {createBrowserRouter, Navigate, RouterProvider, BrowserRouter} from 'react-router-dom'
import logo from "./logo.svg";
import "./App.css";

import JsonStoreView from './components/json_store_view'
import MdxTemplateView from './components/mdx_template_view'
import RootLayout from './components/root_layout'
import templatesConfig from './templates/templates_config'
import TemplateEditor from "./components/editor";
// import { basename } from "path";
import Home from "./components/home";

console.log("app.tsx")
// Routes to be used by React Router, which handles all the
// browser routing within this domain.
const routes = [
  {
    path: "/template_editor",
    element: <TemplateEditor />,
  },
  {
    path: "/app",
    element: <RootLayout><div>QA Type Selector View</div></RootLayout>,
  },
  {
    path: "/",
    element: <RootLayout><Home/></RootLayout>
  },
].concat(Object.keys(templatesConfig).flatMap(dbName => [{
    path: `/app/${dbName}`,
    // TODO: Create a component that provides the functionality
    // to manage the documents in this DB
    element: <RootLayout>(<div>{templatesConfig[dbName].title}</div>)</RootLayout>,
  },
  {
    path: `/app/${dbName}/:docId`,
    element: <RootLayout><MdxTemplateView dbName={dbName} /></RootLayout>,
  },
  {
    path: `/app/${dbName}/:docId/json`,
    element: <RootLayout><JsonStoreView dbName={dbName} /></RootLayout>,
  }
]))

// React Router
const router = createBrowserRouter(routes, { basename: process.env.PUBLIC_URL });

function App() {
  return (
    <RouterProvider router={router}/>    
  )
}


export default App;