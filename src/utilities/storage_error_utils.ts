import type PouchDB from 'pouchdb'

const STORAGE_ERROR_PATTERNS: RegExp[] = [
    /quotaexceedederror/i,
    /exceed(ed|s)?\s+(the\s+)?quota/i,
    /storage\s+quota/i,
    /not\s+enough\s+space/i,
    /disk\s+is\s+full/i,
    /idbobjectstore/i,
    /indexeddb/i,
]

function getErrorText(error: unknown): string {
    if (error instanceof Error) {
        return `${error.name} ${error.message}`
    }

    if (typeof error === 'string') {
        return error
    }

    if (typeof error === 'object' && error !== null) {
        const maybeError = error as {
            name?: string
            message?: string
            reason?: string
            error?: string
            status?: number
        }

        return [
            maybeError.name,
            maybeError.message,
            maybeError.reason,
            maybeError.error,
            maybeError.status,
        ]
            .filter(Boolean)
            .join(' ')
    }

    return ''
}

export function isBrowserStorageError(error: unknown): boolean {
    const text = getErrorText(error)

    return STORAGE_ERROR_PATTERNS.some(pattern => pattern.test(text))
}

export function getStorageErrorMessage(error: unknown): string {
    const errorText = getErrorText(error).trim()

    if (isBrowserStorageError(error)) {
        const guidance =
            'This browser appears to have reached its storage limit, so this project data could not be saved. Please try downloading older projects and removing them from the browser, then try again.'

        return errorText.length > 0
            ? `${guidance} Actual error: ${errorText}`
            : guidance
    }

    if (typeof error === 'string' && error.trim().length > 0) {
        return error
    }

    if (error instanceof Error && error.message.trim().length > 0) {
        return error.message
    }

    if (typeof error === 'object' && error !== null) {
        const dbError = error as PouchDB.Core.Error
        if (typeof dbError.message === 'string' && dbError.message.length > 0) {
            return dbError.message
        }
    }

    return 'An unexpected browser storage error prevented saving. Please try again.'
}

function formatBytes(bytes: number): string {
    if (bytes >= 1_073_741_824) {
        return `${(bytes / 1_073_741_824).toFixed(2)} GB`
    }
    if (bytes >= 1_048_576) {
        return `${(bytes / 1_048_576).toFixed(2)} MB`
    }
    if (bytes >= 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`
    }
    return `${bytes} B`
}

const STORAGE_USED_UNAVAILABLE = 'Browser Storage Used: unavailable'

export interface BrowserStorageUsageDetails {
    text: string
    percent: number | undefined
}

export async function getBrowserStorageUsageDetails(): Promise<BrowserStorageUsageDetails> {
    if (!navigator.storage?.estimate) {
        return {
            text: STORAGE_USED_UNAVAILABLE,
            percent: undefined,
        }
    }

    try {
        const { usage, quota } = await navigator.storage.estimate()

        if (
            typeof usage === 'number' &&
            typeof quota === 'number' &&
            quota > 0
        ) {
            const usagePercent = Math.min(100, (usage / quota) * 100)
            return {
                text: `Browser Storage Used: ${usagePercent.toFixed(2)}% (${formatBytes(usage)} of ${formatBytes(quota)})`,
                percent: usagePercent,
            }
        }
    } catch {
        // Fall through to the unavailable label below.
    }

    return {
        text: STORAGE_USED_UNAVAILABLE,
        percent: undefined,
    }
}

export async function getBrowserStorageUsageText(): Promise<string> {
    const { text } = await getBrowserStorageUsageDetails()

    return text
}
