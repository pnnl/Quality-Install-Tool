import PouchDB from 'pouchdb'
import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom'

import Layout from '../../layouts/default'
import WorkflowView from '../../../workflow_view'
import InstallationsProvider from '../../../../providers/installations_provider'
import ProjectProvider from '../../../../providers/project_provider'

const View: React.FC = () => {
    const { projectId } = useParams<{
        projectId: PouchDB.Core.DocumentId
    }>()

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Layout>
                <ProjectProvider projectId={projectId}>
                    <InstallationsProvider projectId={projectId}>
                        <WorkflowView />
                    </InstallationsProvider>
                </ProjectProvider>
            </Layout>
        </Suspense>
    )
}

export default View
