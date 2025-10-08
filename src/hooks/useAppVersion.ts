import { useState, useEffect } from 'react'

interface AppVersionInfo {
    lastUpdated: string | null
    version: string | null
}

export const useAppVersion = (): AppVersionInfo => {
    const [versionInfo, setVersionInfo] = useState<AppVersionInfo>({
        lastUpdated: null,
        version: null,
    })

    useEffect(() => {
        const getAppVersionInfo = async () => {
            try {
                // Try to get service worker registration date
                if ('serviceWorker' in navigator) {
                    const registration = await navigator.serviceWorker.ready

                    if (registration && registration.active) {
                        // Get the service worker script URL to check its last modified date
                        const swResponse = await fetch(
                            registration.active.scriptURL,
                            {
                                method: 'HEAD',
                            },
                        )

                        const lastModified =
                            swResponse.headers.get('last-modified')
                        if (lastModified) {
                            setVersionInfo({
                                lastUpdated: new Date(
                                    lastModified,
                                ).toLocaleDateString(),
                                version: process.env.REACT_APP_VERSION || null,
                            })
                            return
                        }
                    }
                }
            } catch (error) {
                console.warn('Could not determine app version info:', error)
                // Fallback to current date
                setVersionInfo({
                    lastUpdated: new Date().toLocaleDateString(),
                    version: 'unknown',
                })
            }
        }

        getAppVersionInfo()
    }, [])

    return versionInfo
}
