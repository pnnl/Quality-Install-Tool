import React, { Suspense } from 'react'

import Home from './home'
import Layout from '../../layouts/default'
import ProjectsProvider, {
    type ProjectDocument,
} from '../../../../providers/projects_provider'
import { comparator } from '../../../../utilities/comparison_utils'

const View: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Layout>
                <ProjectsProvider
                    projectComparator={comparator<ProjectDocument>(
                        'last_modified_at',
                        'desc',
                    )}
                >
                    <Home />
                </ProjectsProvider>
            </Layout>
        </Suspense>
    )
}

export default View
