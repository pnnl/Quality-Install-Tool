import PouchDB from 'pouchdb'

import { type Geolocation, type GeolocationSource } from './geolocation.type'
import { type Installer } from './installer.type'
import { type Location } from './location.type'
import { type Timestamp, type TimestampSource } from './timestamp.type'
import templatesConfig from '../templates/templates_config'

export interface Base {
    id: PouchDB.Core.DocumentId
    type: string
    children: PouchDB.Core.DocumentId[]
    data_: BaseData
    metadata_: BaseMetadata
}

export interface BaseData {}

export interface BaseMetadata {
    created_at: Date
    last_modified_at: Date
    attachments: Record<PouchDB.Core.AttachmentId, FileMetadata | PhotoMetadata>
    doc_name: string
    status: 'new' | 'deleted'
}

export interface Installation extends Base {
    type: 'installation'
    data_: BaseData & InstallationData
    metadata_: BaseMetadata & InstallationMetadata
}

export interface InstallationData extends BaseData {}

export interface InstallationMetadata extends BaseMetadata {
    template_title: string
    template_name: keyof typeof templatesConfig
}

export interface Project extends Base {
    type: 'project'
    data_: BaseData & ProjectData
    metadata_: BaseMetadata & ProjectMetadata
}

export interface ProjectData extends BaseData {
    installer?: Installer
    location?: Location
}

export interface ProjectMetadata extends BaseMetadata {}

export interface FileMetadata {
    filename: string
    timestamp: Timestamp
}

export interface PhotoMetadata {
    geolocation: Geolocation
    geolocationSource?: GeolocationSource | null
    timestamp: Timestamp
    timestampSource?: TimestampSource | null
}
