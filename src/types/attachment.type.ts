interface Attachment {
    blob: Blob
    digest?: string
    metadata: Record<string, any>
}

export default Attachment
