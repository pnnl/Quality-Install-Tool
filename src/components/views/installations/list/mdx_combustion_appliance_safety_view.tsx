import React, { Suspense } from 'react'

import LocationStr from '../../../location_str'
import MdxWrapper from '../../../mdx_wrapper'
import { StoreProvider } from '../../../store'
import { useDatabase } from '../../../../providers/database_provider'
import { useProject } from '../../../../providers/project_provider'
import { useWorkflow } from '../../../../providers/workflow_provider'
import { someLocation } from '../../../../utilities/location_utils'

interface MdxCombustionSafetyViewProps {}

const MdxCombustionSafetyView: React.FC<MdxCombustionSafetyViewProps> = () => {
    const db = useDatabase()

    const [project] = useProject()

    const workflow = useWorkflow()

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
                <StoreProvider
                    db={db}
                    docId={project._id}
                    workflowName=""
                    docName={project.metadata_.doc_name}
                    type={project.type}
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <MdxWrapper
                            Component={workflow.template}
                            project={project}
                        />
                    </Suspense>
                </StoreProvider>
            </>
        )
    } else {
        return null
    }
}

export default MdxCombustionSafetyView
