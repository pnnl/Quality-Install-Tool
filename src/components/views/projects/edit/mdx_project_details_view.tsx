import React, { useCallback } from 'react'

import MdxWrapper from '../../../mdx_wrapper'
import { useDatabase } from '../../../../providers/database_provider'
import { useProject } from '../../../../providers/project_provider'
import StoreProvider from '../../../../providers/store_provider'
import DOEProjectDetailsTemplate from '../../../../templates/doe_project_details.mdx'
import { type Base } from '../../../../types/database.types'

interface MdxProjectViewProps {}

const MdxProjectView: React.FC<MdxProjectViewProps> = () => {
    const db = useDatabase()

    const [project, setProject, reloadProject] = useProject()

    const handleChange = useCallback(
        async (doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) => {
            await db.put<Base>(doc)

            await reloadProject()
        },
        [reloadProject],
    )

    if (project) {
        return (
            <>
                <h1>Edit Project Information</h1>
                <h2>{project.metadata_.doc_name}</h2>
                <br />
                <StoreProvider doc={project} onChange={handleChange}>
                    <MdxWrapper
                        Component={DOEProjectDetailsTemplate}
                        project={project}
                    />
                </StoreProvider>
            </>
        )
    } else {
        return null
    }
}

export default MdxProjectView
