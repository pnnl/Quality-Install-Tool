/**
 * Exports a document from a database as a JSON object and initiates a download.
 *
 * This function retrieves a document from the database using its ID (Project)
 * and children (Installations) and then creates a downloadable JSON file with the remaining data.
 *
 * @param db - The database instance from which the document will be fetched.
 * @param docId - The ID of the document to be exported.
 * @param projectName - The name of the project, used to name the downloaded JSON file.
 * @param downloadFileLink - A reference to the download link element, used to initiate the file download.
 *
 * @returns A promise that resolves when the document has been processed and the download initiated.
 */
export async function exportAsJSONObject(
    db: any,
    docId: string,
    projectName: string,
    downloadFileLink: React.RefObject<HTMLAnchorElement>,
): Promise<void> {
    const projectDoc = await db.get(docId, {
        attachments: true,
        revs_info: false,
    })

    const installDocs: any = await db.allDocs({
        keys: projectDoc.children,
        include_docs: true,
        attachments: true,
        revs_info: false,
    })

    const combinedDocs = [
        projectDoc,
        ...installDocs.rows.map((row: { doc: any }) => row.doc),
    ]

    // JSON document created when downloading the document.
    const send_data = JSON.stringify({ all_docs: combinedDocs })

    const downloadLink = downloadFileLink.current
    if (downloadLink) {
        downloadLink.href = URL.createObjectURL(new Blob([send_data]))
        downloadLink.setAttribute('download', projectName + '.json')
        downloadLink.click()
    }
}
