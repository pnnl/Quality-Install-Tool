// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.0/8 are considered localhost for IPv4.
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
        ),
)

type Config = {
    onSuccess?: (registration: ServiceWorkerRegistration) => void
    onUpdate?: (registration: ServiceWorkerRegistration) => void
}

export function register(config?: Config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        // The URL constructor is available in all browsers that support SW.
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href)
        if (publicUrl.origin !== window.location.origin) {
            // Our service worker won't work if PUBLIC_URL is on a different origin
            // from what our page is served on. This might happen if a CDN is used to
            // serve assets; see https://github.com/facebook/create-react-app/issues/2374
            return
        }

        const handleLoad = () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

            if (isLocalhost) {
                // This is running on localhost. Let's check if a service worker still exists or not.
                checkValidServiceWorker(swUrl, config)

                // Add some additional logging to localhost, pointing developers to the
                // service worker/PWA documentation.
                navigator.serviceWorker.ready.then(() => {
                    console.log(
                        'This web app is being served cache-first by a service ' +
                            'worker. To learn more, visit https://cra.link/PWA',
                    )
                })
            } else {
                // Is not localhost. Just register service worker
                registerValidSW(swUrl, config)
            }
        }

        if (document.readyState === 'complete') {
            // If the window is already loaded, run handleLoad immediately.
            handleLoad()
        } else {
            // Otherwise, wait for the load event.
            window.addEventListener('load', handleLoad)
        }
    }
}

function registerValidSW(swUrl: string, config?: Config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing
                if (installingWorker == null) {
                    return
                }
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // At this point, the updated precached content has been fetched,
                            // but the previous service worker will still serve the older
                            // content until all client tabs are closed.
                            console.log(
                                'New content is available and will be used when all ' +
                                    'tabs for this page are closed. See https://cra.link/PWA.',
                            )
                            showUpdateBanner(
                                'A new version of this app is available! <b>Click here</b> to update now. ',
                                () => {
                                    if (registration.waiting) {
                                        registration.waiting.postMessage({
                                            type: 'SKIP_WAITING',
                                        })
                                        registration.waiting.addEventListener(
                                            'statechange',
                                            (event: Event) => {
                                                const target =
                                                    event.target as ServiceWorker | null
                                                if (
                                                    target &&
                                                    target.state === 'activated'
                                                ) {
                                                    window.location.reload()
                                                }
                                            },
                                        )
                                    }
                                },
                            )

                            // Execute callback
                            if (config && config.onUpdate) {
                                config.onUpdate(registration)
                            }
                        } else {
                            // At this point, everything has been precached.
                            // It's the perfect time to display a
                            // "Content is cached for offline use." message.
                            console.log('Content is cached for offline use.')

                            // Execute callback
                            if (config && config.onSuccess) {
                                config.onSuccess(registration)
                            }
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error during service worker registration:', error)
        })
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl, {
        headers: { 'Service-Worker': 'script' },
    })
        .then(response => {
            // Ensure service worker exists, and that we really are getting a JS file.
            const contentType = response.headers.get('content-type')
            if (
                response.status === 404 ||
                (contentType != null &&
                    contentType.indexOf('javascript') === -1)
            ) {
                // No service worker found. Probably a different app. Reload the page.
                navigator.serviceWorker.ready.then(registration => {
                    registration.unregister().then(() => {
                        window.location.reload()
                    })
                })
            } else {
                // Service worker found. Proceed as normal.
                registerValidSW(swUrl, config)
            }
        })
        .catch(() => {
            console.log(
                'No internet connection found. App is running in offline mode.',
            )
        })
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.unregister()
            })
            .catch(error => {
                console.error(error.message)
            })
    }
}
function showUpdateBanner(message: string, onClick?: () => void) {
    let toast = document.getElementById(
        'sw-update-toast',
    ) as HTMLDivElement | null

    // Helper to create or update the message span
    function setMessage(span: HTMLSpanElement) {
        span.innerHTML = message

        span.style.background = '#e3f2fd' // Light blue highlight
        span.style.color = '#0d47a1' // Dark blue text
        span.style.padding = '16px 32px'
        span.style.borderRadius = '12px'
        span.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)'
        span.style.fontSize = '20px'
        span.style.wordBreak = 'break-word'
        span.style.pointerEvents = 'auto'
        span.style.maxWidth = '600px'
        span.style.display = 'inline-block'
        if (onClick) {
            span.style.cursor = 'pointer'
            span.onclick = onClick
        } else {
            span.style.cursor = 'default'
            span.onclick = null
        }
    }

    if (!toast) {
        toast = document.createElement('div')
        toast.id = 'sw-update-toast'
        toast.style.position = 'fixed'
        toast.style.top = '50px'
        toast.style.left = '50%'
        toast.style.transform = 'translateX(-50%)'
        toast.style.zIndex = '9999'
        toast.style.display = 'flex'
        toast.style.alignItems = 'center'
        toast.style.justifyContent = 'center'
        toast.style.background = 'transparent'
        toast.style.boxShadow = 'none'
        toast.style.width = 'auto'
        toast.style.maxWidth = '90vw'
        toast.style.pointerEvents = 'none'

        const messageSpan = document.createElement('span')
        setMessage(messageSpan)

        toast.appendChild(messageSpan)
        document.body.appendChild(toast)
    } else {
        // Update message if toast already exists
        let messageSpan = toast.querySelector('span')
        if (!messageSpan) {
            messageSpan = document.createElement('span')
            toast.appendChild(messageSpan)
        }
        setMessage(messageSpan as HTMLSpanElement)
    }
}
