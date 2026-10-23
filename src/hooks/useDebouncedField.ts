import { useCallback, useEffect, useRef, useState } from 'react'

// Debounce delay (ms) before triggering the DB write.
// Prevents PouchDB 409 conflicts from rapid keystrokes.
const DEBOUNCE_MS = 300

/**
 * Local, debounced state for a text-like input backed by the database.
 *
 * Keystrokes update `localValue` immediately so typing stays responsive; the
 * value is written through `onChange` once the user pauses (300 ms), when the
 * field loses focus, on unmount, or when the page is hidden/closed.
 *
 * - Prop updates from the DB are ignored while an edit is pending or a write
 *   is in flight, so an echo of an older write can't overwrite newer typing.
 *   Once all writes finish, the field adopts the latest DB value.
 * - Writes run one at a time, in order.
 * - If a write fails, the error is logged and the user's text is kept.
 *
 * @param value    Current value from the DB/parent (source of truth when idle).
 * @param onChange Async save callback; receives the raw input string.
 * @returns `localValue` for the input's `value`, `handleChange` for its
 *          `onChange`, and `flush` to save immediately (wire to `onBlur`).
 *
 * @example
 * const { localValue, handleChange, flush } = useDebouncedField(value, onChange)
 * return (
 *     <Form.Control
 *         value={localValue}
 *         onChange={handleChange}
 *         onBlur={flush}
 *     />
 * )
 */
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
    // Unsaved edit waiting for the debounce timer (null when none)
    const pendingRef = useRef<string | null>(null)
    // Number of writes started but not yet completed
    const inFlightRef = useRef(0)
    // Tail of the write queue: writes run one at a time, in order, so a
    // slow earlier write can't land after (and clobber) a newer one
    const queueRef = useRef<Promise<void>>(Promise.resolve())
    // Whether the most recent write failed (keep the user's text if so)
    const failedRef = useRef(false)

    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    // Latest value from the parent, readable from async callbacks
    const valueRef = useRef(value)
    valueRef.current = value

    const isDirty = () => pendingRef.current !== null || inFlightRef.current > 0

    // Sync from the DB only when the user has no unsaved or in-flight edit,
    // otherwise an echo of an earlier write would overwrite newer keystrokes.
    useEffect(() => {
        if (!isDirty()) {
            setLocalValue(value)
        }
    }, [value])

    const flush = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
        const pending = pendingRef.current
        if (pending === null) return
        pendingRef.current = null
        inFlightRef.current += 1
        failedRef.current = false
        queueRef.current = queueRef.current
            .then(() => onChangeRef.current(pending))
            .catch(error => {
                failedRef.current = true
                console.error('Failed to save field value:', error)
            })
            .finally(() => {
                inFlightRef.current -= 1
                // Once everything is saved, adopt the DB value (echoes were
                // skipped while writes were in flight). After a failed write,
                // keep what the user typed.
                if (!isDirty() && !failedRef.current) {
                    setLocalValue(valueRef.current)
                }
            })
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

    // Save a pending edit when the tab is closed or reloaded, where unmount
    // cleanup does not run.
    useEffect(() => {
        window.addEventListener('pagehide', flush)
        return () => window.removeEventListener('pagehide', flush)
    }, [flush])

    return { localValue, handleChange, flush }
}
