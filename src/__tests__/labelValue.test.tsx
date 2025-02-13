//to run this test: npm test -- src/__tests__/labelValue.test.tsx

import { render, screen } from '@testing-library/react'
import { StoreContext } from '../components/store'
import LabelValue, { LabelValueProps } from '../components/label_value'

// Mock StoreContext data
const mockStoreContext = {
    docId: 'TestDocID123',
    attachments: {},
    data: { location: { state: 'WA', zip_code: '99354' } },
    metadata: {},
}

describe('LabelValue Component', () => {
    // Helper function to render the component with StoreContext provider
    const renderWithContext = ({
        label,
        value,
        required = false,
        prefix = '',
        suffix = '',
        decimalPlaces = 1,
        type = 'string',
    }: LabelValueProps) => {
        return render(
            <StoreContext.Provider value={mockStoreContext as any}>
                <LabelValue
                    label={label}
                    value={value}
                    required={required}
                    prefix={prefix}
                    suffix={suffix}
                    decimalPlaces={decimalPlaces}
                    type={type}
                />
            </StoreContext.Provider>,
        )
    }

    test('Label is rendered when label param is present', () => {
        renderWithContext({
            label: 'Label Text',
            type: 'string',
            value: 'test this value',
        })
        expect(screen.getByText(/label text/i)).toBeInTheDocument()
    })

    test('Value is rendered when value param is present', () => {
        renderWithContext({
            label: 'Label Text',
            type: 'string',
            value: 'test this value',
        })
        expect(screen.getByText(/test this value/i)).toBeInTheDocument()
    })

    test('Number value is rendered correctly with decimal places', () => {
        renderWithContext({
            label: 'Label Numeric',
            type: 'number',
            value: 123.456,
            decimalPlaces: 2,
        })
        expect(screen.getByText(/123.46/i)).toBeInTheDocument()
    })

    test('Value with prefix and suffix is rendered correctly', () => {
        renderWithContext({
            label: 'Label with Prefix and Suffix',
            type: 'string',
            value: '50',
            prefix: '$',
            suffix: ' USD',
        })
        expect(screen.getByText(/\$50 USD/i)).toBeInTheDocument()
    })

    test('Should render date value correctly', () => {
        renderWithContext({
            label: 'Label Date',
            type: 'date',
            value: '2025-02-14',
        })
        expect(screen.getByText(/february 14, 2025/i)).toBeInTheDocument()
    })

    test('Should not render when required is false and value is empty', () => {
        const { container } = renderWithContext({
            label: 'Label Text',
            type: 'string',
            value: '',
            required: false,
        })
        expect(container.firstChild).toBeNull()
    })

    test('Should not render when value is empty', () => {
        const { container } = renderWithContext({
            label: 'Label Text',
            type: 'string',
        })
        expect(container.firstChild).toBeNull()
    })

    test('Should render when required is true and value is empty', () => {
        renderWithContext({
            label: 'Label Text',
            type: 'string',
            value: '',
            required: true,
        })
        expect(screen.getByText(/label text/i)).toBeInTheDocument()
    })
})
