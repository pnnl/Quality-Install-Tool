import React from 'react'
import { type PhotoAttachment } from '../utilities/photo_attachment_utils'
import { estimateBlurriness } from '../utilities/image_quality_utils'

function hasBlobData(obj: unknown): obj is { data: Blob } {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'data' in obj &&
        (obj as { data: unknown }).data instanceof Blob
    )
}

export function PhotoQualityWarning({
    attachment,
}: {
    attachment: PhotoAttachment
}): React.ReactElement | null {
    const [warning, setWarning] = React.useState<string | undefined>(undefined)
    React.useEffect(() => {
        let revoked = false
        let url: string | null = null
        const cleanupUrl = () => {
            if (url) {
                URL.revokeObjectURL(url)
                url = null
            }
        }
        async function checkQuality() {
            if (attachment.attachment && hasBlobData(attachment.attachment)) {
                const url = URL.createObjectURL(attachment.attachment.data)
                const img = new window.Image()
                img.onload = async () => {
                    if (revoked) return
                    const blur = await estimateBlurriness(img)
                    setWarning(blur < 100 ? 'Image may be blurry. ' : undefined)
                    cleanupUrl()
                }
                img.onerror = () => {
                    cleanupUrl()
                }
                img.src = url
            }
        }
        void checkQuality()
        return () => {
            revoked = true
            cleanupUrl()
        }
    }, [attachment])
    if (!warning) return null
    return (
        <div style={{ color: 'orange', marginTop: 4 }}>
            <b>Warning:</b> {warning}
        </div>
    )
}
