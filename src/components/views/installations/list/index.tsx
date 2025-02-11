import PouchDB from 'pouchdb'
import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom'

import JobsView from './jobs_view'
import MdxCombustionSafetyView from './mdx_combustion_appliance_safety_view'
import Layout from '../../layouts/default'
import InstallationsProvider, {
    type InstallationDocument,
} from '../../../../providers/installations_provider'
import ProjectProvider from '../../../../providers/project_provider'
import WorkflowProvider from '../../../../providers/workflow_provider'
import TEMPLATES from '../../../../templates'
import { comparator } from '../../../../utilities/comparison_utils'

const View: React.FC = () => {
    const { projectId, workflowName } = useParams<{
        projectId: PouchDB.Core.DocumentId
        workflowName: keyof typeof TEMPLATES
    }>()

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Layout>
                <ProjectProvider
                    projectId={projectId}
                    attachments={
                        workflowName === 'doe_combustion_appliance_safety_tests'
                    }
                >
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
            </Layout>
        </Suspense>
    )
}

export default View
