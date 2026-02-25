/**
 * Detects the device type from the browser's user agent and capabilities
 * @returns 'mobile' or 'desktop'
 */
export const getDeviceType = (): 'mobile' | 'desktop' => {
    // Check user agent for mobile indicators
    const userAgent = navigator.userAgent.toLowerCase()

    // Common mobile user agent patterns
    const mobilePatterns = [
        /android/,
        /webos/,
        /iphone/,
        /ipad/,
        /ipod/,
        /blackberry/,
        /windows phone/,
        /mobile/,
        /opera mini/,
    ]

    // Check if user agent matches mobile patterns
    const isMobileUserAgent = mobilePatterns.some(pattern =>
        pattern.test(userAgent),
    )

    // Alternative check: Touch capability (works on many mobile devices)
    const hasTouchCapability =
        typeof window !== 'undefined' &&
        ('ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            (navigator as unknown as { msMaxTouchPoints: number })
                .msMaxTouchPoints > 0)

    // If either check indicates mobile, return mobile
    if (isMobileUserAgent || hasTouchCapability) {
        return 'mobile'
    }

    return 'desktop'
}

/**
 * Gets a human-readable device name
 * @returns 'Desktop' or 'Mobile (Android/iOS)'
 */
export const getDeviceName = (): string => {
    const deviceType = getDeviceType()
    return deviceType === 'mobile' ? 'Mobile (Android/iOS)' : 'Desktop'
}
