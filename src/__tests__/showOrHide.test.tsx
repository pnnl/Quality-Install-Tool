import { render, screen } from '@testing-library/react'
import { StoreContext } from '../components/store'
import ShowOrHide from '../components/show_or_hide'

// Mock StoreContext data
const mockStoreContext = {
    docId: 'TestDocID123',
    attachments: {},
    data: { location: { state: 'WA', zip_code: '99354' } },
    metadata: {},
}

describe('ShowOrHide Component', () => {
    // Helper function to render the component with StoreContext provider
    const renderWithContext = (props: any) => {
        return render(
            <StoreContext.Provider value={mockStoreContext as any}>
                <ShowOrHide {...props} />
            </StoreContext.Provider>,
        )
    }

    test('renders children when "visible" prop is true', () => {
        renderWithContext({
            visible: true,
            children: <div>Visible Content</div>,
        })

        // Assert that the content is rendered
        expect(screen.getByText('Visible Content')).toBeInTheDocument()
    })

    test('does not render children when "visible" prop is false', () => {
        renderWithContext({
            visible: false,
            children: <div>Invisible Content</div>,
        })

        // Assert that the content is not rendered
        expect(screen.queryByText('Invisible Content')).not.toBeInTheDocument()
    })

    test('renders children when path and value match in context', () => {
        renderWithContext({
            path: 'location.state',
            value: 'WA',
            children: <div>Location is WA</div>,
        })

        // Assert that the content is rendered because the path and value match
        expect(screen.getByText('Location is WA')).toBeInTheDocument()
    })

    test('renders children when path and value match in parent data', () => {
        const mockParent = {
            data_: { location: { state: 'CA', zip_code: '23412' } },
        }

        renderWithContext({
            path: 'location.state',
            value: 'CA',
            parent: mockParent,
            children: <div>Content Visible with Parent Data</div>,
        })

        const content = screen.getByText('Content Visible with Parent Data')
        // Assert that the content is rendered because the parent data matches the path and value
        expect(content).toBeInTheDocument()
    })

    test('does not render children when parent document is passed and path does not match', () => {
        const mockParent = { data: { location: { state: 'NY' } } }

        renderWithContext({
            path: 'location.state',
            value: 'CA',
            parent: mockParent,
            children: <div>Content Visible with Parent Data</div>,
        })

        // Assert that the content is not rendered because the path and value do not match in parent data
        expect(
            screen.queryByText('Content Visible with Parent Data'),
        ).not.toBeInTheDocument()
    })
})
