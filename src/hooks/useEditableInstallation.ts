import { cloneDeep } from 'lodash'
import PouchDB from 'pouchdb'
import { useCallback, useEffect, useState } from 'react'

import {
    type InstallationDocument,
    useInstallation,
} from '../providers/installation_provider'
import { useChangeEventHandler } from '../providers/store_provider'
import { type Base } from '../types/database.types'
import { isEqualBase } from '../utilities/equality_utils'

export default function useEditableInstallation(): [
    InstallationDocument | undefined,
    boolean | undefined,
    (doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) => void,
    () => Promise<void>,
] {
    const [installation] = useInstallation()

    const [editableInstallation, setEditableInstallation] = useState<
        InstallationDocument | undefined
    >(undefined)
    const [isEditableInstallationChanged, setIsEditableInstallationChanged] =
        useState<boolean | undefined>(undefined)

    useEffect(() => {
        if (installation) {
            if (editableInstallation) {
                if (installation._rev !== editableInstallation._rev) {
                    setEditableInstallation(currentEditableInstallation => {
                        return {
                            ...currentEditableInstallation,
                            _rev: installation._rev,
                        } as InstallationDocument
                    })
                } else {
                    // Do nothing.
                }
            } else {
                setEditableInstallation(cloneDeep(installation))

                setIsEditableInstallationChanged(false)
            }
        } else {
            setEditableInstallation(undefined)

            setIsEditableInstallationChanged(undefined)
        }
    }, [editableInstallation, installation])

    const handleChange = useChangeEventHandler()

    const handleChangeEditableInstallation = useCallback(
        (doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta) => {
            if (installation) {
                setEditableInstallation(doc as InstallationDocument)

                setIsEditableInstallationChanged(
                    !isEqualBase(doc, installation),
                )
            }
        },
        [installation],
    )

    const handleSaveEditableInstallation = useCallback(async () => {
        if (editableInstallation) {
            await handleChange(
                editableInstallation as PouchDB.Core.Document<Base> &
                    PouchDB.Core.GetMeta,
            )

            setIsEditableInstallationChanged(false)
        }
    }, [editableInstallation, handleChange])

    return [
        editableInstallation,
        isEditableInstallationChanged,
        handleChangeEditableInstallation,
        handleSaveEditableInstallation,
    ]
}
