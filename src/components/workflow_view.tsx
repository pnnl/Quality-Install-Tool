import React from 'react'

import LocationStr from './location_str'
import TemplatesListGroup from './templates_list_group'
import { useDatabase } from '../providers/database_provider'
import { useInstallations } from '../providers/installations_provider'
import { useProject } from '../providers/project_provider'
import { someLocation } from '../utilities/location_utils'

interface WorkflowViewProps {}

const WorkflowView: React.FC<WorkflowViewProps> = () => {
    const db = useDatabase()

    const [project] = useProject()

    const [installations] = useInstallations()

    if (project) {
        return (
            <div>
                <h1>Choose an Installation Workflow</h1>
                <h2>Installations for {project.metadata_.doc_name}</h2>
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
