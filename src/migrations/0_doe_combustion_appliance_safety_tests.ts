import PouchDB from 'pouchdb'

import {
    type Base,
    type FileMetadata,
    type InstallationData,
    type PhotoMetadata,
    type ProjectData,
} from '../types/database.types'
import {
    getProjects,
    newInstallation,
    putInstallation,
    putProject,
} from '../utilities/database_utils'

interface CombustionSafetyTestsInstallationData extends InstallationData {
    assessment_date?: string
    combustion_safety_tests: Array<Record<string, unknown>>
}

interface CombustionSafetyTestsProjectData extends ProjectData {
    assessment_date?: string
    combustion_safety_tests?: Record<string, Record<string, unknown>>
}

/**
 * The purpose of this function is to transform existing PouchDB "project"
 * documents of the form
 *
 * ```json
 * {
 *   "type": "project",
 *   "data_": {
 *     "assessment_date": "...",
 *     "combustion_safety_tests": {
 *       "A1": { ... },                                    // Data for first appliance.
 *       "A2": { ... }                                     // Data for second appliance.
 *     }
 *   },
 *   "metadata_": {
 *     "attachments": {
 *       "combustion_safety_tests": {
 *         "A1": {
 *           "attachment_0": { ... }                       // Metadata for first attachment for first appliance.
 *         },
 *         "A2": {
 *           "attachment_0": { ... }                       // Metadata for first attachment for second appliance.
 *         }
 *       }
 *     }
 *   },
 *   "_attachments": {
 *     "combustion_safety_tests.A1.attachment_0": { ... }, // First attachment for first appliance.
 *     "combustion_safety_tests.A2.attachment_0": { ... }  // First attachment for second appliance.
 *   }
 * }
 * ```
 *
 * to the form
 *
 * ```json
 * {
 *   "type": "project",
 *   "data_": { ... },
 *   "metadata_": {
 *     "attachments": { ... }
 *   },
 *   "_attachments": { ... }
 * }
 * ```
 *
 * and to create new PouchDB "installation" documents of the form
 *
 * ```json
 * {
 *   "type": "installation",
 *   "data_": {
 *     "assessment_date": "...",
 *     "combustion_safety_tests": [
 *       { ... },                                           // Data for first appliance.
 *       { ... }                                            // Data for second appliance.
 *     ]
 *   },
 *   "metadata_": {
 *     "doc_name": "doe_combustion_appliance_safety_tests",
 *     "attachments": {
 *       "combustion_safety_tests.0.attachment_0": { ... }, // Metadata for first attachment for first appliance.
 *       "combustion_safety_tests.1.attachment_0": { ... }  // Metadata for first attachment for second appliance.
 *     }
 *   },
 *   "_attachments": {
 *     "combustion_safety_tests.0.attachment_0": { ... },   // First attachment for first appliance.
 *     "combustion_safety_tests.1.attachment_0": { ... }    // First attachment for second appliance.
 *   }
 * }
 * ```
 *
 * where the data, metadata and attachments are transferred from the parent
 * PouchDB "project" document to the child PouchDB "installation" document.
 *
 * @param {PouchDB.Database<Base>} db - The database.
 * @returns {PromiseLike<void>}
 */
async function migrate(db: PouchDB.Database<Base>): Promise<void> {
    // await db.info()

    const projects = await getProjects(db, {
        attachments: true,
        binary: true,
    })

    projects
        .filter(project => {
            return ['assessment_date', 'combustion_safety_tests'].some(prop => {
                return prop in project.data_
            })
        })
        .forEach(async project => {
            const projectData =
                project.data_ as CombustionSafetyTestsProjectData

            const installation = newInstallation(
                project.metadata_.doc_name,
                'doe_combustion_appliance_safety_tests',
                undefined,
            )

            const installationData =
                installation.data_ as CombustionSafetyTestsInstallationData

            installationData.combustion_safety_tests = []

            if (projectData.assessment_date) {
                installationData.assessment_date = projectData.assessment_date
            }

            Object.entries(projectData.combustion_safety_tests ?? {}).forEach(
                ([key, value], index) => {
                    installationData.combustion_safety_tests.push(value)

                    Object.entries(
                        (
                            project.metadata_.attachments[
                                'combustion_safety_tests'
                            ] as unknown as Record<
                                string,
                                Record<string, FileMetadata | PhotoMetadata>
                            >
                        )?.[key],
                    ).forEach(([attachmentId, attachmentMetadata]) => {
                        const origAttachmentId = `combustion_safety_tests.${key}.${attachmentId}`

                        const newAttachmentId = `combustion_safety_tests.${index}.${attachmentId}`

                        if (project._attachments) {
                            const attachment = project._attachments[
                                origAttachmentId
                            ] as PouchDB.Core.FullAttachment | undefined

                            if (attachment) {
                                if (!installation._attachments) {
                                    installation._attachments = {}
                                }

                                installation._attachments[newAttachmentId] = {
                                    content_type: attachment.content_type,
                                    data: attachment.data,
                                }

                                installation.metadata_.attachments[
                                    newAttachmentId
                                ] = attachmentMetadata as
                                    | FileMetadata
                                    | PhotoMetadata

                                delete project._attachments[origAttachmentId]
                            }
                        }
                    })
                },
            )

            delete projectData['assessment_date']

            delete projectData['combustion_safety_tests']

            delete project.metadata_.attachments['combustion_safety_tests']

            await putProject(db, project)

            await putInstallation(db, project._id, installation)
        })
}

export default migrate
