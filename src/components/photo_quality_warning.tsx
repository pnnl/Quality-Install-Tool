import React from 'react'
import { type PhotoAttachment } from '../utilities/photo_attachment_utils'
import {
    isImageTooSmall,
    estimateBlurriness,
} from '../utilities/image_quality_utils'

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
        async function checkQuality() {
            if (attachment.attachment && hasBlobData(attachment.attachment)) {
                const url = URL.createObjectURL(attachment.attachment.data)
                const img = new window.Image()
                img.onload = async () => {
                    if (revoked) return
                    let w = ''
                    if (isImageTooSmall(img)) {
                        w += 'Image is too small (min 800x600 recommended). '
                    }
                    const blur = await estimateBlurriness(img)
                    if (blur < 100) {
                        w += 'Image may be blurry. '
                    }
                    setWarning(w || undefined)
                    URL.revokeObjectURL(url)
                }
                img.src = url
            }
        }
        checkQuality()
        return () => {
            revoked = true
        }
    }, [attachment])
    if (!warning) return null
    return (
        <div style={{ color: 'orange', marginTop: 4 }}>
            <b>Warning:</b> {warning}
        </div>
    )
}
