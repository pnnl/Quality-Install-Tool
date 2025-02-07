import PouchDB from 'pouchdb'
import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import templatesConfig from '../templates/templates_config'
import { type Installation } from '../types/database.types'

interface TemplatesListGroupProps {
    projectId: PouchDB.Core.DocumentId
    installationDocsByWorkflowName: Map<
        keyof typeof templatesConfig,
        Array<
            PouchDB.Core.ExistingDocument<Installation> &
                PouchDB.Core.AllDocsMeta
        >
    >
}

const TemplatesListGroup: React.FC<TemplatesListGroupProps> = ({
    projectId,
    installationDocsByWorkflowName,
}) => {
    const workflowNames: Array<keyof typeof templatesConfig> =
        Object.keys(templatesConfig)

    if (workflowNames.length === 0) {
        return null
    } else {
        return (
            <ListGroup>
                {workflowNames.map(workflowName => {
                    const workflowTitle: string =
                        templatesConfig[workflowName].title

                    const installationDocsCount: number =
                        installationDocsByWorkflowName.get(workflowName)
                            ?.length ?? 0

                    return (
                        <LinkContainer
                            key={workflowName}
                            to={`/app/${projectId}/${workflowName}`}
                        >
                            <ListGroup.Item action={true}>
                                {workflowTitle}
                                {installationDocsCount > 0 && (
                                    <> ({installationDocsCount})</>
                                )}
                            </ListGroup.Item>
                        </LinkContainer>
                    )
                })}
            </ListGroup>
        )
    }
}

export default TemplatesListGroup
