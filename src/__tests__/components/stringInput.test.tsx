// Command to run this test: yarn test src/__tests__/components/stringInput.test.tsx
// Regression tests for the debounced-write + focus-guard behavior of StringInput.
// These guard against dropped keystrokes caused by the sync-from-prop effect
// adopting the delayed round-trip echo of our own write while the user types.
import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import StringInput from '../../components/string_input'

const DEBOUNCE_MS = 300

// Mock window.matchMedia for react-bootstrap components
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

const renderInput = (
    props: Partial<React.ComponentProps<typeof StringInput>> = {},
) => {
    const onChange = jest.fn().mockResolvedValue(undefined)
    const utils = render(
        <StringInput
            label="Test Field"
            value=""
            errorMessages={[]}
            hint=""
            onChange={onChange}
            {...props}
        />,
    )
    const input = screen.getByRole('textbox') as HTMLInputElement
    return { ...utils, input, onChange }
}

describe('StringInput debounced write + focus guard', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    test('reflects every keystroke immediately without dropping characters', () => {
        const { input, onChange } = renderInput()

        act(() => {
            fireEvent.focus(input)
            fireEvent.change(input, { target: { value: 'a' } })
            fireEvent.change(input, { target: { value: 'ab' } })
            fireEvent.change(input, { target: { value: 'abc' } })
        })

        // UI shows all typed characters right away...
        expect(input.value).toBe('abc')
        // ...but the DB write has not fired yet (still debouncing).
        expect(onChange).not.toHaveBeenCalled()
    })

    test('writes once with the final value after the debounce window', () => {
        const { input, onChange } = renderInput()

        act(() => {
            fireEvent.focus(input)
            fireEvent.change(input, { target: { value: 'a' } })
            fireEvent.change(input, { target: { value: 'ab' } })
            fireEvent.change(input, { target: { value: 'abc' } })
        })

        act(() => {
            jest.advanceTimersByTime(DEBOUNCE_MS)
        })

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith('abc')
    })

    test('flushes the pending write immediately on blur', () => {
        const { input, onChange } = renderInput()

        act(() => {
            fireEvent.focus(input)
            fireEvent.change(input, { target: { value: 'hello' } })
        })

        // Blur before the debounce elapses.
        act(() => {
            fireEvent.blur(input)
        })

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith('hello')
    })

    test('adopts an external value change while not focused', () => {
        const { input, rerender } = renderInput({ value: 'old' })
        expect(input.value).toBe('old')

        act(() => {
            rerender(
                <StringInput
                    label="Test Field"
                    value="new"
                    errorMessages={[]}
                    hint=""
                    onChange={jest.fn().mockResolvedValue(undefined)}
                />,
            )
        })

        expect(input.value).toBe('new')
    })

    test('does not clobber in-progress typing when a stale prop arrives while focused', () => {
        const onChange = jest.fn().mockResolvedValue(undefined)
        const { input, rerender } = renderInput({ value: '', onChange })

        act(() => {
            fireEvent.focus(input)
            fireEvent.change(input, { target: { value: 'user typing' } })
        })

        // Simulate the delayed round-trip echo of an earlier write arriving
        // while the user is still typing.
        act(() => {
            rerender(
                <StringInput
                    label="Test Field"
                    value="stale echo"
                    errorMessages={[]}
                    hint=""
                    onChange={onChange}
                />,
            )
        })

        // Local edits win while focused.
        expect(input.value).toBe('user typing')
    })
})
