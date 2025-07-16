import { get } from 'lodash'
import PouchDB from 'pouchdb'
import React from 'react'

import Select from './select'
import InstallationsProvider, {
    type InstallationDocument,
    InstallationsContext,
} from '../providers/installations_provider'
import { StoreContext } from '../providers/store_provider'
import { comparator } from '../utilities/comparison_utils'

interface InstallationSelectProps {
    path: string
    label: React.ReactNode
    projectId: PouchDB.Core.DocumentId
    workflowName?: string
}

const InstallationSelect: React.FC<InstallationSelectProps> = ({
    path,
    label,
    projectId,
    workflowName,
}) => {
    return (
        <InstallationsProvider
            projectId={projectId}
            workflowName={workflowName}
            installationComparator={comparator<InstallationDocument>(
                'last_modified_at',
                'desc',
            )}
        >
            <InstallationsContext.Consumer>
                {([installations]) => {
                    if (installations.length === 0) {
                        return null
                    }

                    const options: [string, string][] = installations.map(
                        installation => {
                            return [
                                installation.metadata_.doc_name,
                                installation._id,
                            ]
                        },
                    )

                    return (
                        <StoreContext.Consumer>
                            {({ doc, upsertData }) => {
                                return (
                                    <Select
                                        label={label}
                                        options={options}
                                        value={doc && get(doc.data_, path)}
                                        onChange={async value =>
                                            await upsertData(path, value, [])
                                        }
                                        path={path}
                                    />
                                )
                            }}
                        </StoreContext.Consumer>
                    )
                }}
            </InstallationsContext.Consumer>
        </InstallationsProvider>
    )
}

export default InstallationSelect
