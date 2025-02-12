import PouchDB from 'pouchdb'
import React, { useMemo } from 'react'
import { ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { type InstallationDocument } from '../../../../providers/installations_provider'
import TEMPLATES from '../../../../templates'
import { type Installation } from '../../../../types/database.types'

interface TemplatesListGroupProps {
    projectId: PouchDB.Core.DocumentId
    installations: Array<InstallationDocument>
}

const TemplatesListGroup: React.FC<TemplatesListGroupProps> = ({
    projectId,
    installations,
}) => {
    const installationsByWorkflowName = useMemo<
        Map<keyof typeof TEMPLATES, Array<InstallationDocument>>
    >(() => {
        return installations.reduce((accumulator, installation) => {
            const workflowName = installation.metadata_.template_name

            if (!accumulator.has(workflowName)) {
                accumulator.set(workflowName, [])
            }

            accumulator.get(workflowName).push(installation)

            return accumulator
        }, new Map())
    }, [installations])

    const workflowNames = Object.keys(TEMPLATES)

    if (workflowNames.length === 0) {
        return null
    } else {
        return (
            <ListGroup>
                {workflowNames.map(workflowName => {
                    const workflowTitle = TEMPLATES[workflowName].title

                    const installationDocsCount =
                        installationsByWorkflowName.get(workflowName)?.length ??
                        0

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
