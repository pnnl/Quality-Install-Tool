import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDatabase } from '../../../providers/database_provider'
import { getProject, putProject } from '../../../utilities/database_utils'
import { type Project } from '../../../types/database.types'
import Layout from '../layouts/default'
import { TfiAlert } from 'react-icons/tfi'

const DownloadReminderPage: React.FC = () => {
    const navigate = useNavigate()
    const { projectId, fromHome } = useParams()
    const db = useDatabase()
    const [doNotShowAgain, setDoNotShowAgain] = useState(false)

    useEffect(() => {
        const fetchProjectData = async () => {
            if (projectId) {
                const project = await getProject(db, projectId)
                if (project.metadata_.show_download_reminder === false) {
                    setDoNotShowAgain(true)
                }
            }
        }
        void fetchProjectData()
    }, [db, projectId])

    const handleSave = async () => {
        if (projectId && doNotShowAgain) {
            const project = await getProject(db, projectId)
            const updatedProject = {
                ...project,
                metadata_: {
                    ...project.metadata_,
                    show_download_reminder: false,
                },
            }
            await putProject(db, updatedProject as Project)
        }

        if (projectId && !fromHome) {
            navigate(`/app/${projectId}/workflows`)
        } else {
            navigate('/')
        }
    }

    return (
        <Layout>
            <div className="container download-reminder-container">
                <h2>
                    <center>
                        <TfiAlert color="red" size={27} /> Important: Prevent
                        Accidental Loss by Saving Your Work
                    </center>
                </h2>
                <br />
                <p>
                    The Quality Install Tool stores all project data, including
                    your photos and notes, locally in your browser.{' '}
                    <b>
                        Clearing site data in your browser’s Settings will
                        permanently erase your data.
                    </b>{' '}
                    To avoid possible data loss, we strongly encourage you to
                    download each project after making changes. The downloaded
                    project can be imported later and acts as a backup. It can
                    also be shared with others for importing into their
                    browsers. &nbsp;
                    <Link to="/faqs">Learn more</Link>
                </p>
                {/* <Form.Check
                    type="checkbox"
                    label="Do not show again"
                    checked={doNotShowAgain}
                    onChange={e => {
                        setDoNotShowAgain(e.target.checked)
                    }}
                /> */}
                <div className="d-flex justify-content-end mt-3">
                    <Button variant="primary" onClick={handleSave}>
                        I Understand
                    </Button>
                </div>
            </div>
        </Layout>
    )
}

export default DownloadReminderPage
