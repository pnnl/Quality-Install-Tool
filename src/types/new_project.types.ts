export type Project = {
    type: string
    data_: Record<string, any>
    metadata_: {
        doc_name: string
        created_at: string
        last_modified_at: string
        attachments: Record<string, any>
        status: string
    }
    children: any[]
    _id: string
    _rev: string
}

export type InstallerData = {
    technician_name?: string
    company_name?: string
    company_address?: string
    company_phone?: string
    email?: string
}

export type LocationData = {
    street_address?: string
    city?: string
    state?: string
    zip_code?: string
}

export type FormData = {
    installer?: InstallerData
    location?: LocationData
}
