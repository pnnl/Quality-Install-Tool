// Command to run this test: yarn test src/__tests__/components/numberInput.test.tsx
// Regression tests for the debounced-write + focus-guard behavior of NumberInput.
// NumberInput previously wrote to the DB on every keystroke with no local state;
// these tests lock in the local-state + debounce + focus-guard behavior.
import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import NumberInput from '../../components/number_input'

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
    props: Partial<React.ComponentProps<typeof NumberInput>> = {},
) => {
    const onChange = jest.fn().mockResolvedValue(undefined)
    const utils = render(
        <NumberInput
            label="Amount"
            prefix=""
            suffix=""
            value=""
            errorMessages={[]}
            hint=""
            onChange={onChange}
            {...props}
        />,
    )
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    return { ...utils, input, onChange }
}

describe('NumberInput debounced write + focus guard', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    test('reflects typed digits immediately without an eager write', () => {
        const { input, onChange } = renderInput()

        act(() => {
            fireEvent.focus(input)
            fireEvent.change(input, { target: { value: '4' } })
            fireEvent.change(input, { target: { value: '42' } })
        })

        expect(input.value).toBe('42')
        expect(onChange).not.toHaveBeenCalled()
    })

    test('writes once with the final value after the debounce window', () => {
        const { input, onChange } = renderInput()

        act(() => {
            fireEvent.focus(input)
            fireEvent.change(input, { target: { value: '4' } })
            fireEvent.change(input, { target: { value: '42' } })
        })

        act(() => {
            jest.advanceTimersByTime(DEBOUNCE_MS)
        })

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith('42')
    })

    test('flushes the pending write immediately on blur', () => {
        const { input, onChange } = renderInput()

        act(() => {
            fireEvent.focus(input)
            fireEvent.change(input, { target: { value: '99' } })
        })

        act(() => {
            fireEvent.blur(input)
        })

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith('99')
    })

    test('adopts an external value change while not focused', () => {
        const { input, rerender } = renderInput({ value: '1' })
        expect(input.value).toBe('1')

        act(() => {
            rerender(
                <NumberInput
                    label="Amount"
                    prefix=""
                    suffix=""
                    value="2"
                    errorMessages={[]}
                    hint=""
                    onChange={jest.fn().mockResolvedValue(undefined)}
                />,
            )
        })

        expect(input.value).toBe('2')
    })

    test('does not clobber in-progress typing when a stale prop arrives while focused', () => {
        const onChange = jest.fn().mockResolvedValue(undefined)
        const { input, rerender } = renderInput({ value: '', onChange })

        act(() => {
            fireEvent.focus(input)
            fireEvent.change(input, { target: { value: '123' } })
        })

        act(() => {
            rerender(
                <NumberInput
                    label="Amount"
                    prefix=""
                    suffix=""
                    value="9"
                    errorMessages={[]}
                    hint=""
                    onChange={onChange}
                />,
            )
        })

        expect(input.value).toBe('123')
    })
})
