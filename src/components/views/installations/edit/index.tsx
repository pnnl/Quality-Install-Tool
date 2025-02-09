import PouchDB from 'pouchdb'
import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom'

import MdxTemplateView from './mdx_template_view'
import Layout from '../../layouts/default'
import InstallationProvider from '../../../../providers/installation_provider'
import ProjectProvider from '../../../../providers/project_provider'
import WorkflowProvider from '../../../../providers/workflow_provider'
import templatesConfig from '../../../../templates/templates_config'

const View: React.FC = () => {
    const { projectId, workflowName, jobId } = useParams<{
        projectId: PouchDB.Core.DocumentId
        workflowName: keyof typeof templatesConfig
        jobId: PouchDB.Core.DocumentId
    }>()

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Layout>
                <ProjectProvider projectId={projectId}>
                    <WorkflowProvider workflowName={workflowName}>
                        <InstallationProvider installationId={jobId}>
                            <MdxTemplateView />
                        </InstallationProvider>
                    </WorkflowProvider>
                </ProjectProvider>
            </Layout>
        </Suspense>
    )
}

export default View
