import PouchDB from 'pouchdb'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import LocationStr from './location_str'
import MdxWrapper from './mdx_wrapper'
import { StoreProvider } from './store'
import { useDatabase } from '../providers/database_provider'
import DOECombustionTestTemplate from '../templates/doe_workflow_combustion_appliance_safety_tests.mdx'
import { type Project } from '../types/database.types'
import { getProject } from '../utilities/database_utils'
import { someLocation } from '../utilities/location_utils'

interface MdxCombustionSafetyViewProps {}

const MdxCombustionSafetyView: React.FC<MdxCombustionSafetyViewProps> = () => {
    const db = useDatabase()

    const { projectId } = useParams()

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

    return (
        <>
            <h1>Combustion Appliance Safety Testing</h1>
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
            <br />
            <StoreProvider
                db={db}
                docId={projectId as PouchDB.Core.DocumentId}
                workflowName=""
                docName={projectDoc?.metadata_?.doc_name ?? ''}
                type="project"
            >
                <Suspense fallback={<div>Loading...</div>}>
                    <MdxWrapper Component={DOECombustionTestTemplate} />
                </Suspense>
            </StoreProvider>
        </>
    )
}

export default MdxCombustionSafetyView
