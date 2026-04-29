import PouchDB from 'pouchdb'

import { type Base, type Project } from '../types/database.types'
import { getProjects, putProject } from '../utilities/database_utils'
import { getDefaultProjectPhotoResolution } from '../utilities/photo_resolution_utils'

export function shouldMigrateProjectPhotoResolution(
    project: PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta,
): boolean {
    return !project.data_.photo?.resolution
}

export function transformProjectPhotoResolution(
    project: PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta,
): PouchDB.Core.ExistingDocument<Project> & PouchDB.Core.AllDocsMeta {
    if (!shouldMigrateProjectPhotoResolution(project)) {
        return project
    }

    return {
        ...project,
        data_: {
            ...project.data_,
            photo: {
                ...project.data_.photo,
                resolution: getDefaultProjectPhotoResolution(),
            },
        },
    }
}

export async function migrate(db: PouchDB.Database<Base>): Promise<void> {
    const projects = await getProjects(db, {
        attachments: true,
        binary: true,
    })

    projects
        .filter(project => {
            return shouldMigrateProjectPhotoResolution(project)
        })
        .forEach(async project => {
            await putProject(db, transformProjectPhotoResolution(project))
        })
}

export default migrate
