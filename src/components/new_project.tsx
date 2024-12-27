import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDB } from '../utilities/database_utils'
import DocNameInputWrapper from './doc_name_input_wrapper'
import StringInputWrapper from './string_input_wrapper'
import USStateSelectWrapper from './us_state_select_wrapper'
import PhotoInputWrapper from './photo_input_wrapper'
import SaveCancelButtonWrapper from './save_cancel_button_wrapper'
import { retrieveProjectDocs } from '../utilities/database_utils'

export default function NewProject() {
    const { projectId } = useParams()
    const [projectDocs, setProjectDocs] = useState<any>({})
    const db = useDB()

    const project_info = async (): Promise<void> => {
        // Dynamically import the function when needed
        const { retrieveProjectDocs } = await import(
            '../utilities/database_utils'
        )

        retrieveProjectDocs(db).then((res: any) => {
            setProjectDocs(res)
        })
    }

    useEffect(() => {
        project_info()
    }, [])

    console.log(projectDocs)

    return (
        <>
            <h4>New Project Information</h4>
            <DocNameInputWrapper label="Project Name" path="doc_name" />
            <h5>Installer Information</h5>
            <p>
                <em>
                    The Installer information is optional, but we recommend
                    filling in at least one field for reference in the the final
                    report.
                </em>
            </p>
            <StringInputWrapper label="Technician Name" path="installer.name" />
            <StringInputWrapper
                label="Installation Company"
                path="installer.company_name"
            />
            <StringInputWrapper
                label="Company Address"
                path="installer.mailing_address"
            />
            <StringInputWrapper label="Company Phone" path="installer.phone" />
            <StringInputWrapper label="Company Email" path="installer.email" />
            <h5>Project Address</h5>
            <StringInputWrapper
                label="Street Address"
                path="location.street_address"
            />
            <StringInputWrapper label="City" path="location.city" />
            <USStateSelectWrapper label="State" path="location.state" />
            <StringInputWrapper label="Zip Code" path="location.zip_code" />
            <PhotoInputWrapper
                id="building_number_photo"
                label="Building Number – Photo"
                children="Provide a photo of the building that shows the building number."
            ></PhotoInputWrapper>
            <SaveCancelButtonWrapper path="status" />
        </>
    )
}
