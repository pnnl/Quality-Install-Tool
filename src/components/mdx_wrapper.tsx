import { MDXProvider } from '@mdx-js/react'
import { MDXProps } from 'mdx/types'
import PouchDB from 'pouchdb'
import React, { Suspense } from 'react'

import components from '../mdx-components'
import { StoreContext } from '../providers/store_provider'
import { type TemplateProps } from '../templates'
import { type Project } from '../types/database.types'

interface MdxWrapperProps {
    Component: React.FC<MDXProps & TemplateProps>
    project?: PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta
}

const MdxWrapper: React.FC<MdxWrapperProps> = ({ Component, project }) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return (
                    <div className="container" id="mdx-container">
                        {doc && (
                            <Suspense fallback={<div>Loading...</div>}>
                                <MDXProvider components={components}>
                                    <Component
                                        project={project}
                                        data={doc.data_}
                                        metadata={doc.metadata_}
                                    />
                                </MDXProvider>
                            </Suspense>
                        )}
                    </div>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default MdxWrapper
