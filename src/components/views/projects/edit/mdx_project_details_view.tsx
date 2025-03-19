import React, { useCallback, useMemo } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import DocNameInputWrapper from '../../shared/doc_name_input_wrapper'
import MdxWrapper from '../../../mdx_wrapper'
import useEditableProject from '../../../../hooks/useEditableProject'
import { useProject } from '../../../../providers/project_provider'
import StoreProvider from '../../../../providers/store_provider'
import DOEProjectDetailsTemplate from '../../../../templates/doe_project_details.mdx'
import { hasErrors } from '../../../../utilities/validation_utils'

type MdxProjectViewProps = Record<string, never>

const MdxProjectView: React.FC<MdxProjectViewProps> = () => {
    const navigate = useNavigate()

    const [project] = useProject()

    const [
        editableProject,
        isEditableProjectChanged,
        handleChangeEditableProject,
        handleSaveEditableProject,
    ] = useEditableProject()

    const isProjectValid = useMemo<boolean | undefined>(() => {
        return editableProject && !hasErrors(editableProject)
    }, [editableProject])

    const handleClickCancel = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            if (isEditableProjectChanged) {
                if (
                    !window.confirm(
                        'This project has unsaved changes. Do you want to discard your changes?',
                    )
                ) {
                    return false
                }
            }

            navigate('/')

            return false
        },
        [isEditableProjectChanged, navigate],
    )

    const handleClickSaveProject = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            event.preventDefault()

            await handleSaveEditableProject()

            navigate('/')

            return false
        },
        [handleSaveEditableProject, navigate],
    )

    if (editableProject) {
        return (
            <>
                <h1>Edit Project Information</h1>
                <br />
                <StoreProvider
                    doc={editableProject}
                    onChange={handleChangeEditableProject}
                >
                    <div className="container">
                        <DocNameInputWrapper
                            currentValue={project?.metadata_.doc_name}
                        />
                    </div>
                    <MdxWrapper
                        Component={DOEProjectDetailsTemplate}
                        project={editableProject}
                    />
                </StoreProvider>
                <center>
                    <Button variant="secondary" onClick={handleClickCancel}>
                        Cancel
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                        variant="primary"
                        disabled={
                            editableProject === undefined ||
                            !isProjectValid ||
                            !isEditableProjectChanged
                        }
                        onClick={handleClickSaveProject}
                    >
                        Save Project
                    </Button>
                </center>
            </>
        )
    } else {
        return null
    }
}

export default MdxProjectView
