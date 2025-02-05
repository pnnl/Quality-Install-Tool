import PouchDB from 'pouchdb'

import { getProject } from './database_utils'
import templatesConfig from '../templates/templates_config'
import { type Base, type Project } from '../types/database.types'
import { type Location } from '../types/location.type'

export type ProjectSummary = {
    project_name: string
    installation_name: string
} & Location

export async function getProjectSummary(
    db: PouchDB.Database<Base>,
    projectId: PouchDB.Core.DocumentId,
    workflowName: string,
): Promise<ProjectSummary> {
    // await db.info()

    const projectDoc: PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta =
        await getProject(db, projectId)

    const projectSummary: ProjectSummary & Location = {
        project_name: projectDoc.metadata_.doc_name,
        installation_name: templatesConfig[workflowName]?.title ?? '',
        street_address: projectDoc.data_.location?.street_address
            ? projectDoc.data_.location?.street_address + ', '
            : null,
        city: projectDoc.data_.location?.city
            ? projectDoc.data_.location?.city + ', '
            : null,
        state: projectDoc.data_.location?.state
            ? projectDoc.data_.location?.state + ' '
            : null,
        zip_code: projectDoc.data_.location?.zip_code
            ? projectDoc.data_.location?.zip_code
            : null,
    }

    return projectSummary
}
