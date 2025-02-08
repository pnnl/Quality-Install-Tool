import PouchDB from 'pouchdb'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import MdxWrapper from './mdx_wrapper'
import { StoreProvider } from './store'
import { useDatabase } from '../providers/database_provider'
import DOEProjectDetailsTemplate from '../templates/doe_project_details.mdx'
import { type Project } from '../types/database.types'
import { getProject } from '../utilities/database_utils'

interface MdxProjectViewProps {}

const MdxProjectView: React.FC<MdxProjectViewProps> = () => {
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
        <StoreProvider
            db={db}
            docId={projectId as PouchDB.Core.DocumentId}
            workflowName=""
            docName={projectDoc?.metadata_?.doc_name ?? ''}
            type="project"
        >
            <Suspense fallback={<div>Loading...</div>}>
                <MdxWrapper
                    Component={DOEProjectDetailsTemplate}
                    Project={projectDoc}
                />
            </Suspense>
        </StoreProvider>
    )
}

export default MdxProjectView
