import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import React from 'react'
import Checkbox from '../../components/checkbox'

describe('Checkbox Component', () => {
    const label = 'Select Options'
    const options = ['Option 1', 'Option 2', 'Option 3']
    const onChange = jest.fn()
    beforeEach(() => {
        onChange.mockClear()
    })

    // Utility function to render the component
    const renderComponent = (
        hidden: boolean = false,
        value: string[] = [],
    ): RenderResult => {
        return render(
            <Checkbox
                hidden={hidden}
                label={label}
                onChange={onChange}
                options={options}
                value={value} // Correctly typed as string[]
            />,
        )
    }

    test('renders correctly with label', () => {
        const { getByText } = renderComponent()
        expect(getByText(label)).toBeInTheDocument()
    })

    test('renders without label when hidden', () => {
        const { container } = renderComponent(true)
        expect(container.firstChild).toHaveAttribute('hidden')
    })

    test('renders correct number of checkboxes with correct labels', () => {
        const { getByLabelText } = renderComponent()
        options.forEach(option => {
            expect(getByLabelText(option)).toBeInTheDocument()
        })
    })

    test('checkbox checked state reflects initial value', () => {
        const value = ['Option 2']
        const { getByLabelText } = renderComponent(false, value)
        expect(getByLabelText('Option 1')).not.toBeChecked()
        expect(getByLabelText('Option 2')).toBeChecked()
        expect(getByLabelText('Option 3')).not.toBeChecked()
    })

    test('updates checked state and calls onChange when checkbox is clicked', () => {
        const value: string[] = ['Option 1']
        const { getByLabelText } = renderComponent(false, value)

        // Click on 'Option 2' checkbox
        fireEvent.click(getByLabelText('Option 2'))
        expect(onChange).toHaveBeenNthCalledWith(1, ['Option 1', 'Option 2'])
    })

    test('calls onChange with empty array when all checkboxes are unchecked', () => {
        const value: string[] = ['Option 1']
        const { getByLabelText } = renderComponent(false, value)

        // Click to uncheck 'Option 1'
        fireEvent.click(getByLabelText('Option 1'))
        expect(onChange).toHaveBeenNthCalledWith(1, [])
    })
})
