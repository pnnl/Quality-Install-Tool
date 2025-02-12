export function sendBlob(blob: Blob, fileName: string): void {
    const url: string = URL.createObjectURL(blob)

    const el: HTMLAnchorElement = document.createElement('a')

    el.href = url

    el.setAttribute('download', fileName)

    try {
        document.body.appendChild(el)

        el.click()
    } catch (cause) {
        throw new Error('sendBlob: Failed to send Blob.', {
            cause,
        })
    } finally {
        document.body.removeChild(el)

        URL.revokeObjectURL(url)
    }
}
