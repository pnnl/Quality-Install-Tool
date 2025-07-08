import { get } from 'lodash'
import React, { useId, useMemo, useState } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

import ProjectsProvider, {
    useProjects,
} from '../../../providers/projects_provider'
import { StoreContext } from '../../../providers/store_provider'
import { type Validator, validate } from '../../../utilities/validation_utils'

const path = 'doc_name' as const

interface DocNameInputProps {
    currentValue: string | undefined
}

const DocNameInput: React.FC<DocNameInputProps> = ({ currentValue }) => {
    const id = useId()
    const [touched, setTouched] = useState(false)

    const [projects] = useProjects()

    const projectDocumentNames = useMemo<string[]>(() => {
        return projects.map(project => {
            return project.metadata_.doc_name
        })
    }, [projects])

    const validators = useMemo<Array<Validator<string>>>(() => {
        const re = /^(?![\s-])[a-z0-9, -]{1,64}$/i

        return [
            input => {
                if (re.test(input)) {
                    return undefined
                } else {
                    return 'The project name must be no more than 64 characters consisting of letters, numbers, dashes, and single spaces. Single spaces can only appear between other characters.'
                }
            },
            input => {
                if (
                    input.trim() !== currentValue &&
                    projectDocumentNames.includes(input.trim())
                ) {
                    return 'Project name already exists. Please choose a different name.'
                } else {
                    return undefined
                }
            },
        ]
    }, [currentValue, projectDocumentNames])

    return (
        <StoreContext.Consumer>
            {({ doc, upsertMetadata }) => {
                const value = (doc && get(doc.metadata_, path)) ?? ''

                const errorMessages = validate(value, validators)

                return (
                    <FloatingLabel controlId={id} label="Project Name">
                        <Form.Control
                            onChange={async (
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                setTouched(true)
                                await upsertMetadata(
                                    path,
                                    event.target.value,
                                    validate(event.target.value, validators),
                                )
                            }}
                            type="text"
                            value={value}
                            isInvalid={touched && errorMessages.length > 0}
                        />
                        {errorMessages.length > 0 && (
                            <Form.Control.Feedback
                                type={touched ? 'invalid' : 'valid'}
                            >
                                {errorMessages.join(' ')}
                            </Form.Control.Feedback>
                        )}
                    </FloatingLabel>
                )
            }}
        </StoreContext.Consumer>
    )
}

const DocNameInputWrapper: React.FC<DocNameInputProps> = props => {
    return (
        <ProjectsProvider>
            <DocNameInput {...props} />
        </ProjectsProvider>
    )
}

export default DocNameInputWrapper
