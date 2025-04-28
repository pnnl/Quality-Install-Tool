import PouchDB from 'pouchdb'
import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom'

import MdxProjectView from './mdx_project_details_view'
import Layout from '../../layouts/default'
import ProjectProvider from '../../../../providers/project_provider'

const View: React.FC = () => {
    const { projectId } = useParams<{
        projectId: PouchDB.Core.DocumentId
    }>()

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Layout>
                <ProjectProvider projectId={projectId} attachments={true}>
                    <MdxProjectView />
                </ProjectProvider>
            </Layout>
        </Suspense>
    )
}

export default View
