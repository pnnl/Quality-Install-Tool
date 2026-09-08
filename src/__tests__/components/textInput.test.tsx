// Command to run this test: yarn test src/__tests__/components/textInput.test.tsx
// Regression tests for the debounced-write + focus-guard behavior of TextInput
// (the multi-line textarea variant).
import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import TextInput from '../../components/text_input'

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
    props: Partial<React.ComponentProps<typeof TextInput>> = {},
) => {
    const onChange = jest.fn().mockResolvedValue(undefined)
    const utils = render(
        <TextInput
            label="Notes"
            value=""
            errorMessages={[]}
            onChange={onChange}
            {...props}
        />,
    )
    const input = screen.getByRole('textbox') as HTMLTextAreaElement
    return { ...utils, input, onChange }
}

describe('TextInput debounced write + focus guard', () => {
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
            fireEvent.change(input, { target: { value: 'no' } })
            fireEvent.change(input, { target: { value: 'note' } })
        })

        expect(input.value).toBe('note')
        expect(onChange).not.toHaveBeenCalled()
    })

    test('writes once with the final value after the debounce window', () => {
        const { input, onChange } = renderInput()

        act(() => {
            fireEvent.focus(input)
            fireEvent.change(input, { target: { value: 'note' } })
        })

        act(() => {
            jest.advanceTimersByTime(DEBOUNCE_MS)
        })

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith('note')
    })

    test('flushes the pending write immediately on blur', () => {
        const { input, onChange } = renderInput()

        act(() => {
            fireEvent.focus(input)
            fireEvent.change(input, { target: { value: 'draft' } })
        })

        act(() => {
            fireEvent.blur(input)
        })

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith('draft')
    })

    test('adopts an external value change while not focused', () => {
        const { input, rerender } = renderInput({ value: 'old' })
        expect(input.value).toBe('old')

        act(() => {
            rerender(
                <TextInput
                    label="Notes"
                    value="new"
                    errorMessages={[]}
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

        act(() => {
            rerender(
                <TextInput
                    label="Notes"
                    value="stale echo"
                    errorMessages={[]}
                    onChange={onChange}
                />,
            )
        })

        expect(input.value).toBe('user typing')
    })
})
