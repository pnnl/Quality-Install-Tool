import React from 'react'

import LocationStr from '../../../location_str'
import MdxWrapper from '../../../mdx_wrapper'
import { useInstallation } from '../../../../providers/installation_provider'
import { useProject } from '../../../../providers/project_provider'
import StoreProvider, {
    useChangeEventHandler,
} from '../../../../providers/store_provider'
import { useWorkflow } from '../../../../providers/workflow_provider'
import { someLocation } from '../../../../utilities/location_utils'

type MdxTemplateViewProps = Record<string, never>

const MdxTemplateView: React.FC<MdxTemplateViewProps> = () => {
    const [project] = useProject()

    const workflow = useWorkflow()

    const [installation] = useInstallation()

    const handleChange = useChangeEventHandler()

    if (project && installation && workflow) {
        return (
            <>
                <h1>{workflow.title}</h1>
                <h2>
                    {workflow.sub_title.titleCase} for{' '}
                    {project.metadata_.doc_name}
                </h2>
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
                <StoreProvider doc={installation} onChange={handleChange}>
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

export default MdxTemplateView
