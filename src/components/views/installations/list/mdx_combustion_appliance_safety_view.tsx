import React, { useCallback } from 'react'

import LocationStr from '../../../location_str'
import MdxWrapper from '../../../mdx_wrapper'
import { useDatabase } from '../../../../providers/database_provider'
import { useProject } from '../../../../providers/project_provider'
import StoreProvider from '../../../../providers/store_provider'
import { useWorkflow } from '../../../../providers/workflow_provider'
import { type Base } from '../../../../types/database.types'
import { someLocation } from '../../../../utilities/location_utils'

interface MdxCombustionSafetyViewProps {}

const MdxCombustionSafetyView: React.FC<MdxCombustionSafetyViewProps> = () => {
    const db = useDatabase()

    const [project, setProject, reloadProject] = useProject()

    const workflow = useWorkflow()

    const handleChange = useCallback(
        async (doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) => {
            await db.put<Base>(doc)

            await reloadProject()
        },
        [reloadProject],
    )

    if (project && workflow) {
        return (
            <>
                <h1>{workflow.title}</h1>
                <h2>Installation for {project.metadata_.doc_name}</h2>
                {project.data_.location &&
                    someLocation(project.data_.location) && (
                        <p className="address">
                            <LocationStr
                                location={project.data_.location}
                                separators={[', ', ', ', ' ']}
                            />
                        </p>
                    )}
                <br />
                <StoreProvider doc={project} onChange={handleChange}>
                    <MdxWrapper
                        Component={workflow.template}
                        project={project}
                    />
                </StoreProvider>
            </>
        )
    } else {
        return null
    }
}

export default MdxCombustionSafetyView
