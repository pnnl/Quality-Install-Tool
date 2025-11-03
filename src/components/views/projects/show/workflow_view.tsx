import React from 'react'

import TemplatesListGroup from './templates_list_group'
import { useInstallations } from '../../../../providers/installations_provider'
import { useProject } from '../../../../providers/project_provider'

type WorkflowViewProps = Record<string, never>

const WorkflowView: React.FC<WorkflowViewProps> = () => {
    const [project] = useProject()

    const [installations] = useInstallations()

    if (project) {
        return (
            <div>
                <div className="container">
                    <TemplatesListGroup
                        projectId={project._id}
                        installations={installations}
                    />
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default WorkflowView
