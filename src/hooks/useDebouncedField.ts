import { useCallback, useEffect, useRef, useState } from 'react'

// Debounce delay (ms) before triggering the DB write.
// Prevents PouchDB 409 conflicts from rapid keystrokes.
const DEBOUNCE_MS = 300

export function useDebouncedField(
    value: string | number,
    onChange: (value: string) => Promise<void>,
): {
    localValue: string | number
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    flush: () => void
} {
    const [localValue, setLocalValue] = useState<string | number>(value)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const pendingRef = useRef<string | null>(null)

    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    // Sync from the DB only when the user has no unsaved edit, otherwise an
    // echo of an earlier write would overwrite newer keystrokes.
    useEffect(() => {
        if (pendingRef.current === null) {
            setLocalValue(value)
        }
    }, [value])

    const flush = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
        const pending = pendingRef.current
        if (pending !== null) {
            pendingRef.current = null
            onChangeRef.current(pending).catch(error => {
                console.error('Failed to save field value:', error)
            })
        }
    }, [])

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value
            setLocalValue(newValue)
            pendingRef.current = newValue

            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            timerRef.current = setTimeout(flush, DEBOUNCE_MS)
        },
        [flush],
    )

    // Save any pending edit on unmount rather than dropping it.
    useEffect(() => flush, [flush])

    return { localValue, handleChange, flush }
}
