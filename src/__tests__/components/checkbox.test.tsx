import React from 'react'
import { render, fireEvent, RenderResult } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Checkbox from '../../components/checkbox'

describe('Checkbox Component', () => {
    const label = 'Select Options'
    const options = ['Option 1', 'Option 2', 'Option 3']
    const onChange = jest.fn()

    // Utility function to render the component
    const renderComponent = (
        hidden: boolean = false,
        value: string[] = [],
    ): RenderResult => {
        return render(
            <Checkbox
                label={label}
                options={options}
                onChange={onChange}
                value={value} // Correctly typed as string[]
                hidden={hidden}
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
        expect(getByLabelText('Option 2')).toBeChecked()
        expect(getByLabelText('Option 1')).not.toBeChecked()
        expect(getByLabelText('Option 3')).not.toBeChecked()
    })

    test('updates checked state and calls onChange when checkbox is clicked', async () => {
        const value: string[] = ['Option 1']
        const { getByLabelText } = renderComponent(false, value)

        // Click on 'Option 2' checkbox
        fireEvent.click(getByLabelText('Option 2'))
        expect(onChange).toHaveBeenNthCalledWith(1, ['Option 1', 'Option 2'])

        // Confirm current checkbox state reflects initial value
        expect(onChange).toHaveBeenLastCalledWith(['Option 1', 'Option 2'])

        // Untick 'Option 1' checkbox (simulating change)
        fireEvent.click(getByLabelText('Option 1'))
        expect(onChange).toHaveBeenNthCalledWith(2, ['Option 2'])
    })
})
