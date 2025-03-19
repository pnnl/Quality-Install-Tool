import React, { Suspense } from 'react'

import MdxProjectView from './mdx_project_details_view'
import Layout from '../../layouts/default'

const View: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Layout>
                <MdxProjectView />
            </Layout>
        </Suspense>
    )
}

export default View
