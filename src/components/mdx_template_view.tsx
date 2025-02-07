import PouchDB from 'pouchdb'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import LocationStr from './location_str'
import MdxWrapper from './mdx_wrapper'
import { StoreProvider } from './store'
import templatesConfig, {
    type TemplateConfiguration,
} from '../templates/templates_config'
import {
    type Base,
    type Installation,
    type Project,
} from '../types/database.types'
import {
    DEFAULT_POUCHDB_DATABASE_NAME,
    getInstallation,
    getProject,
    useDB,
} from '../utilities/database_utils'
import { someLocation } from '../utilities/location_utils'

interface MdxTemplateViewProps {}

const MdxTemplateView: React.FC<MdxTemplateViewProps> = () => {
    const db: PouchDB.Database<Base> = useDB()

    const { jobId, projectId, workflowName } = useParams()

    const [installationDoc, setInstallationDoc] = useState<
        (PouchDB.Core.Document<Installation> & PouchDB.Core.GetMeta) | undefined
    >(undefined)
    const [projectDoc, setProjectDoc] = useState<
        (PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta) | undefined
    >(undefined)

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

    const reloadInstallationDoc = useCallback(async () => {
        const installationDoc: PouchDB.Core.Document<Installation> &
            PouchDB.Core.GetMeta = await getInstallation(
            db,
            jobId as PouchDB.Core.DocumentId,
        )

        setInstallationDoc(installationDoc)
    }, [jobId])

    useEffect(() => {
        reloadInstallationDoc()

        return () => {
            setInstallationDoc(undefined)
        }
    }, [reloadInstallationDoc])

    const templateConfiguration = useMemo<TemplateConfiguration>(() => {
        return templatesConfig[workflowName as keyof typeof templatesConfig]
    }, [workflowName])

    return (
        <>
            <h1>{templateConfiguration.title}</h1>
            <h2>
                Installation
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
            {installationDoc?.metadata_.doc_name && (
                <p>
                    <center>
                        <b>{installationDoc.metadata_.doc_name}</b>
                    </center>
                </p>
            )}
            <br />
            <StoreProvider
                dbName={DEFAULT_POUCHDB_DATABASE_NAME}
                docId={jobId as PouchDB.Core.DocumentId}
                workflowName={workflowName as keyof typeof templatesConfig}
                docName={installationDoc?.metadata_.doc_name ?? ''}
                type={'installation'}
                parentId={projectId as PouchDB.Core.DocumentId}
            >
                <MdxWrapper
                    Component={templateConfiguration.template}
                    Project={projectDoc}
                />
            </StoreProvider>
        </>
    )
}

export default MdxTemplateView
