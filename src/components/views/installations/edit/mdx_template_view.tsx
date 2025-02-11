import React, { Suspense } from 'react'

import LocationStr from '../../../location_str'
import MdxWrapper from '../../../mdx_wrapper'
import { StoreProvider } from '../../../store'
import { useDatabase } from '../../../../providers/database_provider'
import { useInstallation } from '../../../../providers/installation_provider'
import { useProject } from '../../../../providers/project_provider'
import { useWorkflow } from '../../../../providers/workflow_provider'
import { someLocation } from '../../../../utilities/location_utils'

interface MdxTemplateViewProps {}

const MdxTemplateView: React.FC<MdxTemplateViewProps> = () => {
    const db = useDatabase()

    const [project] = useProject()

    const workflow = useWorkflow()

    const [installation] = useInstallation()

    if (project && installation && workflow) {
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
                <center>
                    <b>{installation.metadata_.doc_name}</b>
                </center>
                <br />
                <StoreProvider
                    db={db}
                    docId={installation._id}
                    workflowName={installation.metadata_.template_name}
                    docName={installation.metadata_.doc_name}
                    type={installation.type}
                    parentId={project._id}
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

export default MdxTemplateView
