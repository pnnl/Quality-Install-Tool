import PouchDB from 'pouchdb'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useParams } from 'react-router-dom'

import LocationStr from './location_str'
import TemplatesListGroup from './templates_list_group'
import templatesConfig from '../templates/templates_config'
import {
    type Base,
    type Installation,
    type Project,
} from '../types/database.types'
import {
    getInstallations,
    getProject,
    useDB,
} from '../utilities/database_utils'
import { someLocation } from '../utilities/location_utils'

interface WorkflowViewProps {}

const WorkflowView: React.FC<WorkflowViewProps> = () => {
    const db: PouchDB.Database<Base> = useDB()

    const { projectId } = useParams()

    const [installationDocs, setInstallationDocs] = useState<
        Array<
            PouchDB.Core.ExistingDocument<Installation> &
                PouchDB.Core.AllDocsMeta
        >
    >([])
    const [projectDoc, setProjectDoc] = useState<
        (PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta) | undefined
    >(undefined)

    const installationDocsByWorkflowName = useMemo<
        Map<
            keyof typeof templatesConfig,
            Array<
                PouchDB.Core.ExistingDocument<Installation> &
                    PouchDB.Core.AllDocsMeta
            >
        >
    >(() => {
        return installationDocs.reduce((accumulator, installationDoc) => {
            const workflowName = installationDoc.metadata_.template_name

            if (!accumulator.has(workflowName)) {
                accumulator.set(workflowName, [])
            }

            accumulator.get(workflowName).push(installationDoc)

            return accumulator
        }, new Map())
    }, [installationDocs])

    const reloadProjectDoc = useCallback(async () => {
        const projectDoc: PouchDB.Core.Document<Project> &
            PouchDB.Core.GetMeta = await getProject(
            db,
            projectId as PouchDB.Core.DocumentId,
        )

        setProjectDoc(projectDoc)
    }, [projectId])

    useEffect(() => {
        reloadProjectDoc()

        return () => {
            setProjectDoc(undefined)
        }
    }, [reloadProjectDoc])

    const reloadInstallationDocs = useCallback(async () => {
        const installationDocs: Array<
            PouchDB.Core.ExistingDocument<Installation> &
                PouchDB.Core.AllDocsMeta
        > = await getInstallations(
            db,
            projectId as PouchDB.Core.DocumentId,
            undefined,
        )

        setInstallationDocs(installationDocs)
    }, [projectId])

    useEffect(() => {
        reloadInstallationDocs()

        return () => {
            setInstallationDocs([])
        }
    }, [reloadInstallationDocs])

    return (
        <div>
            <h1>Choose an Installation Workflow</h1>
            <h2>
                Installations
                {projectDoc?.metadata_.doc_name && (
                    <> for {projectDoc.metadata_.doc_name}</>
                )}
            </h2>
            {projectDoc?.data_.location &&
                someLocation(projectDoc.data_.location) && (
                    <p className="address">
                        <LocationStr
                            location={projectDoc.data_.location}
                            separators={[', ', ', ', ' ']}
                        />
                    </p>
                )}
            <br />
            <div className="container">
                <TemplatesListGroup
                    projectId={projectId as PouchDB.Core.DocumentId}
                    installationDocsByWorkflowName={
                        installationDocsByWorkflowName
                    }
                />
            </div>
        </div>
    )
}

export default WorkflowView
