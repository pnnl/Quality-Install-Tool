import PouchDB from 'pouchdb'

import { type Geolocation, type GeolocationSource } from './geolocation.type'
import { type Installer } from './installer.type'
import { type Location } from './location.type'
import { type Timestamp, type TimestampSource } from './timestamp.type'

export interface Base {
    type: string
    children: PouchDB.Core.DocumentId[]
    data_: BaseData
    metadata_: BaseMetadata
}

export interface BaseData {
    links?: Record<string, PouchDB.Core.DocumentId>
}

export interface BaseMetadata {
    created_at: Timestamp
    last_modified_at: Timestamp
    attachments: Record<PouchDB.Core.AttachmentId, FileMetadata | PhotoMetadata>
    doc_name: string
    errors?: {
        data_: Record<string, unknown>
        metadata_: Record<string, unknown>
    }
}

export interface Installation extends Base {
    type: 'installation'
    data_: BaseData & InstallationData
    metadata_: BaseMetadata & InstallationMetadata
}

export type InstallationData = BaseData

export interface InstallationMetadata extends BaseMetadata {
    template_title: string
    template_name: string
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

export interface ProjectMetadata extends BaseMetadata {
    is_downloaded?: boolean
    last_downloaded_date?: Timestamp
    show_download_reminder?: boolean
}

export interface FileMetadata {
    filename?: string
    timestamp: Timestamp
}

export interface PhotoMetadata {
    geolocation: Geolocation
    geolocationSource?: GeolocationSource | null
    timestamp: Timestamp
    timestampSource?: TimestampSource | null
}
