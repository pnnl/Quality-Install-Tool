import { MDXProps } from 'mdx/types'
import PouchDB from 'pouchdb'
import React, { Suspense } from 'react'

import { StoreContext } from '../providers/store_provider'
import { type TemplateProps, COMPONENTS } from '../templates'
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
                                <Component
                                    components={COMPONENTS}
                                    project={project}
                                    data={doc.data_}
                                    metadata={doc.metadata_}
                                />
                            </Suspense>
                        )}
                    </div>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default MdxWrapper
