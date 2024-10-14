import PouchDB from 'pouchdb'
import JSZip from 'jszip'
import DBName from '../components/db_details'

const db = new PouchDB(DBName)

// Function to convert a Blob to ArrayBuffer
function blobToArrayBuffer(blob: Blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () =>
            reject(new Error('Failed to read Blob as ArrayBuffer'))
        reader.readAsArrayBuffer(blob)
    })
}

// Function to collect all documents and attachments, then download as a ZIP
export async function downloadDocumentsWithAttachments() {
    try {
        const allDocs = await db.allDocs({ include_docs: true })
        const zip = new JSZip()

        // Collect promises for fetching all attachments
        const fetchPromises = allDocs.rows.map(async row => {
            const doc = row.doc as any
            const docFileName = `${doc._id}.json` // Name for the document file

            // Add the document data as a JSON file
            zip.file(docFileName, JSON.stringify(doc, null, 2))

            if (doc._attachments) {
                for (const attachmentName in doc._attachments) {
                    const response = (await db.getAttachment(
                        doc._id,
                        attachmentName,
                    )) as Blob
                    const arrayBuffer = (await blobToArrayBuffer(
                        response,
                    )) as Blob
                    const attachmentNameByType =
                        response.type === 'application/pdf'
                            ? attachmentName + '.pdf'
                            : attachmentName + '.jpeg'
                    zip.file(attachmentNameByType, arrayBuffer) // Add the attachment to the ZIP
                }
            }
        })

        // Wait for all documents and attachments to be fetched
        await Promise.all(fetchPromises)
        // Generate the ZIP file
        const zipContent = await zip.generateAsync({ type: 'blob' })
        return zipContent
    } catch (error) {
        console.error('Error downloading documents and attachments:', error)
    }
}

// Usage example
