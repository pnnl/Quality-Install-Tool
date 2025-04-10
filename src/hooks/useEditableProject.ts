import { cloneDeep } from 'lodash'
import PouchDB from 'pouchdb'
import { useCallback, useEffect, useState } from 'react'

import { type ProjectDocument, useProject } from '../providers/project_provider'
import { useChangeEventHandler } from '../providers/store_provider'
import { type Base } from '../types/database.types'
import { isEqualBase } from '../utilities/equality_utils'

export default function useEditableProject(): [
    ProjectDocument | undefined,
    boolean | undefined,
    (doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) => void,
    () => Promise<void>,
] {
    const [project] = useProject()

    const [editableProject, setEditableProject] = useState<
        ProjectDocument | undefined
    >(undefined)
    const [isEditableProjectChanged, setIsEditableProjectChanged] = useState<
        boolean | undefined
    >(undefined)

    useEffect(() => {
        if (project) {
            if (editableProject) {
                if (project._rev !== editableProject._rev) {
                    setEditableProject(currentEditableProject => {
                        return {
                            ...currentEditableProject,
                            _rev: project._rev,
                        } as ProjectDocument
                    })
                } else {
                    // Do nothing.
                }
            } else {
                setEditableProject(cloneDeep(project))

                setIsEditableProjectChanged(false)
            }
        } else {
            setEditableProject(undefined)

            setIsEditableProjectChanged(undefined)
        }
    }, [editableProject, project])

    const handleChange = useChangeEventHandler()

    const handleChangeEditableProject = useCallback(
        (doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) => {
            if (project) {
                setEditableProject(doc as ProjectDocument)

                setIsEditableProjectChanged(!isEqualBase(doc, project))
            }
        },
        [project],
    )

    const handleSaveEditableProject = useCallback(async () => {
        if (editableProject) {
            await handleChange(
                editableProject as PouchDB.Core.Document<Base> &
                    PouchDB.Core.GetMeta,
            )

            setIsEditableProjectChanged(false)
        }
    }, [editableProject, handleChange])

    return [
        editableProject,
        isEditableProjectChanged,
        handleChangeEditableProject,
        handleSaveEditableProject,
    ]
}
