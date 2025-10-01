import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useDatabase } from '../../../providers/database_provider'
import { getProject, putProject } from '../../../utilities/database_utils'
import { type Project } from '../../../types/database.types'
import Layout from '../layouts/default'
import { TfiAlert } from 'react-icons/tfi'

const DownloadReminderPage: React.FC = () => {
    const navigate = useNavigate()
    const { projectId, fromHome } = useParams()
    const db = useDatabase()

    const handleSave = async () => {
        if (projectId) {
            const project = await getProject(db, projectId)
            const updatedProject = {
                ...project,
                metadata_: {
                    ...project.metadata_,
                    show_download_reminder: false,
                },
            }
            await putProject(db, updatedProject as Project)
            if (fromHome) {
                navigate('/')
            } else {
                navigate(`/app/${projectId}/workflows`)
            }
        } else {
            navigate('/')
        }
    }

    return (
        <Layout>
            <div className="container">
                <h1>
                    <TfiAlert color="red" size={27} /> Warning: Protect Your
                    Work from Accidental Loss
                </h1>
                <p>
                    The Quality Install Tool stores all project data, including
                    your photos and notes, <b>locally on your browser</b>. This
                    means your work is not saved to the cloud or your device.
                    While this approach eliminates the need for logging in, it
                    also means that{' '}
                    <b>we do not have a backup of your projects</b>.
                </p>
                <p>
                    <strong>Important:</strong>
                    <br />
                    <ul>
                        <li>
                            <b>Your projects will be lost </b> if you clear your
                            browser cache, history, or reset browser settings.
                        </li>
                        <li>
                            <b>
                                All work, including photos and notes, will be
                                permanently erased,
                            </b>
                            and recovery will not be possible.
                        </li>
                    </ul>
                </p>
                <p>
                    <strong>How to Keep Your Work Safe:</strong>
                    <br />
                    <ul>
                        <li>
                            <b>Download your projects regularly</b> to ensure
                            you have copies saved outside of the browser.
                        </li>
                        <li>
                            Avoid clearing your browser history/cache without
                            first backing up your work
                        </li>
                    </ul>
                </p>
                <p>
                    Take precautions to avoid unexpected data loss — your
                    projects rely entirely on your ability to save and back them
                    up!
                </p>
                <p>
                    <a
                        href={process.env.REACT_APP_HOMEPAGE}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Learn more here
                    </a>
                </p>

                <p className="align-right">
                    <Button variant="primary" onClick={handleSave}>
                        I Understand
                    </Button>
                </p>
            </div>
        </Layout>
    )
}

export default DownloadReminderPage
