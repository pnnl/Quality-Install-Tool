import { get } from 'lodash'
import InstallationsProvider, {
    InstallationsContext,
    type InstallationDocument,
} from '../providers/installations_provider'
import { StoreContext } from '../providers/store_provider'
import { comparator } from '../utilities/comparison_utils'
import PouchDB from 'pouchdb'
import React from 'react'
import Select from './select'

interface InstallationSelectProps {
    label: React.ReactNode
    path: string
    projectId: PouchDB.Core.DocumentId
    workflowName?: string
}

const InstallationSelect: React.FC<InstallationSelectProps> = ({
    label,
    path,
    projectId,
    workflowName,
}) => {
    return (
        <InstallationsProvider
            installationComparator={comparator<InstallationDocument>(
                'last_modified_at',
                'desc',
            )}
            projectId={projectId}
            workflowName={workflowName}
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
                                        path={path}
                                        value={doc && get(doc.data_, path)}
                                        onChange={async value =>
                                            await upsertData(path, value, [])
                                        }
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
