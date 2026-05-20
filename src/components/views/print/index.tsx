import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface PrintPayload {
    html: string
    title?: string
}

function readStorageValue(key: string): string | null {
    try {
        return localStorage.getItem(key) || sessionStorage.getItem(key)
    } catch {
        return null
    }
}

function clearStorageValue(key: string): void {
    try {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
    } catch {
        // Ignore storage cleanup failures in restricted browser modes.
    }
}

function waitForImages(container: HTMLElement): Promise<void> {
    const images = Array.from(container.querySelectorAll('img'))

    if (images.length === 0) {
        return Promise.resolve()
    }

    return Promise.all(
        images.map(image => {
            if (image.complete && image.naturalWidth > 0) {
                return Promise.resolve()
            }

            return new Promise<void>(resolve => {
                const done = () => {
                    image.removeEventListener('load', done)
                    image.removeEventListener('error', done)
                    resolve()
                }

                image.addEventListener('load', done)
                image.addEventListener('error', done)
            })
        }),
    ).then(() => undefined)
}

const PrintView: React.FC = () => {
    const [searchParams] = useSearchParams()
    const [payload, setPayload] = useState<PrintPayload | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const storageKey = useMemo(() => {
        return searchParams.get('key')
    }, [searchParams])

    useEffect(() => {
        if (!storageKey) {
            setErrorMessage('No print content key was provided.')
            return
        }

        const rawFromStorage = readStorageValue(storageKey)

        const raw =
            rawFromStorage ||
            (typeof window.name === 'string' && window.name.trim().length > 0
                ? window.name
                : null)

        if (!raw) {
            setErrorMessage(
                'Print content was not found. Please return to the report and click Print Report again.',
            )
            return
        }

        try {
            const parsed = JSON.parse(raw) as PrintPayload
            if (!parsed.html) {
                setErrorMessage('Print content is empty.')
                return
            }
            setPayload(parsed)
        } catch {
            setErrorMessage('Print content could not be read.')
        }
    }, [storageKey])

    useEffect(() => {
        if (!payload || !containerRef.current || !storageKey) {
            return
        }

        document.title =
            payload.title || process.env.REACT_APP_PRINT_TITLE || 'QIT Report'

        let isActive = true

        const cleanupPayload = () => {
            clearStorageValue(storageKey)
            window.name = ''
        }

        const handleAfterPrint = () => {
            cleanupPayload()
            window.removeEventListener('afterprint', handleAfterPrint)
        }

        window.addEventListener('afterprint', handleAfterPrint)

        void waitForImages(containerRef.current).then(() => {
            if (!isActive) {
                return
            }

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.print()
                })
            })
        })

        // Safety cleanup in case afterprint is not fired by browser.
        const cleanupTimeout = window.setTimeout(() => {
            cleanupPayload()
            window.removeEventListener('afterprint', handleAfterPrint)
        }, 60000)

        return () => {
            isActive = false
            window.clearTimeout(cleanupTimeout)
            window.removeEventListener('afterprint', handleAfterPrint)
        }
    }, [payload, storageKey])

    const backButton = (
        <div className="print-back-bar no-print">
            <button
                className="btn btn-secondary btn-sm"
                onClick={() => window.close()}
            >
                ← Back to QI Tool
            </button>
        </div>
    )

    if (errorMessage) {
        return (
            <div className="container mt-3">
                {backButton}
                <p className="mt-3">{errorMessage}</p>
            </div>
        )
    }

    if (!payload) {
        return (
            <div className="container mt-3">
                {backButton}
                <p className="mt-3">Preparing print view...</p>
            </div>
        )
    }

    return (
        <>
            {backButton}
            <div
                ref={containerRef}
                className="container"
                dangerouslySetInnerHTML={{ __html: payload.html }}
            />
        </>
    )
}

export default PrintView
