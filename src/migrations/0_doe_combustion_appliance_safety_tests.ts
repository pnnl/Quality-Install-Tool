import PouchDB from 'pouchdb'

import {
    type Base,
    type FileMetadata,
    type Installation,
    type InstallationData,
    type PhotoMetadata,
    type Project,
    type ProjectData,
} from '../types/database.types'
import {
    getInstallations,
    getProjects,
    newInstallation,
    putInstallation,
    putProject,
} from '../utilities/database_utils'

export const combustionSafetyTestsWorkflowNames: string[] = [
    'doe_workflow_attic_air_sealing_and_insulation',
    'doe_workflow_central_ducted_split_heat_pump',
    'doe_workflow_ductless_heat_pump',
    'doe_workflow_foundation_airsealing_and_insulation',
    'doe_workflow_heat_pump_water_heater',
    'doe_workflow_mechanical_ventilation',
    'doe_workflow_slab_foundation_exterior',
    'doe_workflow_wall_air_sealing_and_insulation_exterior',
]

interface CombustionSafetyTestsInstallationData extends InstallationData {
    assessment_date?: string
    combustion_safety_tests: Array<Record<string, unknown>>
}

interface CombustionSafetyTestsInstallationMetadata {
    errors?: {
        data_: {
            combustion_safety_tests: Array<Record<string, unknown>>
        }
    }
}

interface CombustionSafetyTestsProjectData extends ProjectData {
    assessment_date?: string
    combustion_safety_tests?: Record<string, Record<string, unknown>>
}

export async function migrate(db: PouchDB.Database<Base>): Promise<void> {
    // await db.info()

    const projects = await getProjects(db, {
        attachments: true,
        binary: true,
    })

    projects
        .filter(project => {
            return shouldMigrateCombustionSafetyTestsProject(project)
        })
        .forEach(async project => {
            const [transformedProject, transformedInstallation] =
                transformCombustionSafetyTestsProject(project)

            await putProject(db, transformedProject)

            await putInstallation(
                db,
                transformedProject._id,
                transformedInstallation,
            )

            const installations = await getInstallations(
                db,
                transformedProject._id,
                combustionSafetyTestsWorkflowNames,
            )

            installations.forEach(async installation => {
                await putInstallation(db, transformedProject._id, {
                    ...installation,
                    data_: {
                        ...installation.data_,
                        links: {
                            ...installation.data_.links,
                            doe_combustion_appliance_safety_test_doc_id:
                                transformedInstallation._id as PouchDB.Core.DocumentId,
                        },
                    },
                })
            })
        })
}

export function shouldMigrateCombustionSafetyTestsProject(
    project: PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta,
): boolean {
    return ['assessment_date', 'combustion_safety_tests'].some(key => {
        return key in project.data_
    })
}

/**
 * The purpose of this function is to transformCombustionSafetyTestsProject existing PouchDB "project"
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
 *       { ... },                                             // Data for first appliance.
 *       { ... }                                              // Data for second appliance.
 *     ]
 *   },
 *   "metadata_": {
 *     "template_name": "doe_combustion_appliance_safety_tests",
 *     "template_title": "Combustion Appliance Safety Testing",
 *     "attachments": {
 *       "combustion_safety_tests[0].attachment_0": { ... },  // Metadata for first attachment for first appliance.
 *       "combustion_safety_tests[1].attachment_0": { ... }   // Metadata for first attachment for second appliance.
 *     }
 *   },
 *   "_attachments": {
 *     "combustion_safety_tests[0].attachment_0": { ... },    // First attachment for first appliance.
 *     "combustion_safety_tests[1].attachment_0": { ... }     // First attachment for second appliance.
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

export function transformCombustionSafetyTestsProject(
    project: PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta,
): [
    PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta,
    PouchDB.Core.PutDocument<Installation> & PouchDB.Core.AllDocsMeta,
] {
    const projectData = project.data_ as CombustionSafetyTestsProjectData

    const installation = newInstallation(
        project.metadata_.doc_name,
        'doe_combustion_appliance_safety_tests',
        'Combustion Appliance Safety Testing',
        undefined,
    )

    installation.metadata_.errors = {
        data_: {
            combustion_safety_tests: [],
        },
        metadata_: {},
    }

    const installationData =
        installation.data_ as CombustionSafetyTestsInstallationData

    const installationMetadata =
        installation.metadata_ as CombustionSafetyTestsInstallationMetadata

    installationData.combustion_safety_tests = []

    if (projectData.assessment_date) {
        installationData.assessment_date = projectData.assessment_date
    }

    Object.entries(projectData.combustion_safety_tests ?? {}).forEach(
        ([key, value], index) => {
            installationData.combustion_safety_tests.push(value)

            installationMetadata.errors?.data_.combustion_safety_tests.push({})

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

                const newAttachmentId = `combustion_safety_tests[${index}].${attachmentId}`

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

                        installation.metadata_.attachments[newAttachmentId] =
                            attachmentMetadata as FileMetadata | PhotoMetadata

                        delete project._attachments[origAttachmentId]
                    }
                }
            })
        },
    )

    delete projectData['assessment_date']

    delete projectData['combustion_safety_tests']

    delete project.metadata_.attachments['combustion_safety_tests']

    return [project, installation]
}

export default migrate
