import PouchDB from 'pouchdb'
import React, { useMemo, useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { type InstallationDocument } from '../../../../providers/installations_provider'
import templates from '../../../../templates'

interface TemplatesListGroupProps {
    projectId: PouchDB.Core.DocumentId
    installations: Array<InstallationDocument>
}

const TemplatesListGroup: React.FC<TemplatesListGroupProps> = ({
    projectId,
    installations,
}) => {
    const installationsByWorkflowName = useMemo<
        Map<string, Array<InstallationDocument>>
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

    const [searchTerm, setSearchTerm] = useState('')
    const workflowNames = Object.keys(templates)
    const filteredWorkflowNames = searchTerm
        ? workflowNames.filter(
              name =>
                  templates[name].title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : workflowNames

    if (workflowNames.length === 0) {
        return null
    } else {
        return (
            <>
                <div style={{ marginBottom: 16 }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search workflows by name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <ListGroup>
                    {filteredWorkflowNames.length > 0 ? (
                        filteredWorkflowNames.map(workflowName => {
                            const workflowTitle = templates[workflowName].title
                            const installationDocsCount =
                                installationsByWorkflowName.get(workflowName)
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
                        })
                    ) : (
                        <ListGroup.Item>
                            No matching workflows found.
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </>
        )
    }
}

export default TemplatesListGroup
