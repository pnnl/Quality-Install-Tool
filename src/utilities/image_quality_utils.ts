// Utility functions for image quality validation
// Utility functions for image quality validation

/**
 * Checks if an image is too small (below min width/height)
 * @param {HTMLImageElement} image
 * @param {number} minWidth
 * @param {number} minHeight
 * @returns {boolean}
 */
export function isImageTooSmall(
    image: HTMLImageElement,
    minWidth = 800,
    minHeight = 600,
): boolean {
    return image.naturalWidth < minWidth || image.naturalHeight < minHeight
}

/**
 * Estimates image blurriness using variance of Laplacian (simple JS version)
 * @param {HTMLImageElement} image
 * @returns {Promise<number>} - Lower values are blurrier
 */
export async function estimateBlurriness(
    image: HTMLImageElement,
): Promise<number> {
    // Draw image to canvas
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return 0
    ctx.drawImage(image, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // Simple Laplacian kernel
    const kernel = [0, 1, 0, 1, -4, 1, 0, 1, 0]
    let sum = 0,
        sumSq = 0,
        count = 0
    for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
            let lap = 0
            let k = 0
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const ni = ((y + ky) * canvas.width + (x + kx)) * 4
                    lap += imageData.data[ni] * kernel[k++]
                }
            }
            sum += lap
            sumSq += lap * lap
            count++
        }
    }
    const mean = sum / count
    const variance = sumSq / count - mean * mean
    return variance
}
