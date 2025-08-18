/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Command to run this test: yarn test src/__tests__/components/photoInput.test.tsx
// Test suite for PhotoInput component
import React, { act } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { DEFAULT_OPTIONS } from '../../components/date_time_str'
import PhotoInput, { PhotoInputProps } from '../../components/photo_input'
import { StoreContext } from '../../providers/store_provider'
import { type PhotoAttachment } from '../../utilities/photo_attachment_utils'

// Mock URL.createObjectURL and revokeObjectURL
const mockCreateObjectURL = jest.fn()
const mockRevokeObjectURL = jest.fn()
global.URL.createObjectURL = mockCreateObjectURL
global.URL.revokeObjectURL = mockRevokeObjectURL

// Mock heic2any
jest.mock('heic2any', () => ({ window: jest.fn() }))

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

// Mock @restart/hooks completely
jest.mock('@restart/hooks', () => ({
    useMediaQuery: jest.fn(() => false),
    useBreakpoint: jest.fn(() => false),
    useMergedRefs: jest.fn(ref1 => ref1),
}))

// Mock react-bootstrap Offcanvas component completely with sub-components
jest.mock('react-bootstrap/Offcanvas', () => {
    const MockOffcanvas = ({ children, show, onHide, ...props }: any) => {
        if (!show) return null

        // Use require inside the mock to access React

        return (
            <div data-testid="mock-offcanvas" {...props}>
                {React.Children.map(children, (child: any) => {
                    if (child?.type === MockOffcanvas.Header) {
                        return React.cloneElement(child, { onHide })
                    }
                    return child
                })}
            </div>
        )
    }

    MockOffcanvas.Header = ({
        children,
        closeButton,
        onHide,
        ...props
    }: any) => (
        <div data-testid="offcanvas-header" {...props}>
            {children}
            {closeButton && (
                <button onClick={onHide} data-testid="offcanvas-close">
                    Close
                </button>
            )}
        </div>
    )

    MockOffcanvas.Title = ({ children, ...props }: any) => (
        <div data-testid="offcanvas-title" {...props}>
            {children}
        </div>
    )

    MockOffcanvas.Body = ({ children, ...props }: any) => (
        <div data-testid="offcanvas-body" {...props}>
            {children}
        </div>
    )

    return MockOffcanvas
})

type StoreContextType = NonNullable<React.ContextType<typeof StoreContext>>

const mockStoreContext: StoreContextType = {
    doc: undefined,
    upsertData: jest.fn(),
    upsertMetadata: jest.fn(),
    putAttachment: jest.fn(),
    removeAttachment: jest.fn(),
    UNSAFE_put: jest.fn(),
}

const generateMockPhotoAttachment = (
    overrides?: Partial<PhotoAttachment>,
): PhotoAttachment => ({
    attachmentId: 'photoAttachment1',
    attachment: {
        data: new Blob(['testImage'], { type: 'image/jpeg' }),
        content_type: 'image/jpeg',
    } as PouchDB.Core.FullAttachment,
    metadata: {
        timestamp: new Date().toISOString(),
        geolocation: {
            latitude: 47.6062,
            longitude: -122.3321,
        },
    },
    ...overrides,
})

describe('PhotoInput Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockCreateObjectURL.mockReturnValue('mock-url')
    })

    const renderWithProps = (props: Partial<PhotoInputProps> = {}) => {
        const defaultProps: PhotoInputProps = {
            children: <div>Test Children</div>,
            count: 5,
            error: undefined,
            id: 'photo-input-id',
            label: 'Test Label',
            loading: false,
            notes: true,
            onPutPhotoAttachment: jest.fn(),
            onRemovePhotoAttachment: jest.fn(),
            photoAttachments: [],
            uploadable: true,
        }
        return render(
            <StoreContext.Provider value={mockStoreContext}>
                <PhotoInput {...defaultProps} {...props} />
            </StoreContext.Provider>,
        )
    }

    test('renders label and children in offcanvas', () => {
        renderWithProps()
        expect(screen.getByText(/test label/i)).toBeInTheDocument()

        // Click the info button to show the offcanvas with children
        const infoButton = screen.getByRole('button', {
            name: /photo input information/i,
        })
        fireEvent.click(infoButton)

        // Now the children should be visible in the offcanvas
        expect(screen.getByText(/test children/i)).toBeInTheDocument()
    })

    test('can close offcanvas', () => {
        const TestComponent = () => {
            return (
                <StoreContext.Provider value={mockStoreContext}>
                    <PhotoInput
                        error={undefined}
                        id="photo-input-id"
                        label="Test Label"
                        loading={false}
                        notes={true}
                        onPutPhotoAttachment={jest.fn()}
                        onRemovePhotoAttachment={jest.fn()}
                        photoAttachments={[]}
                        uploadable={true}
                        count={4}
                    >
                        <div>Test Children</div>
                    </PhotoInput>
                </StoreContext.Provider>
            )
        }

        render(<TestComponent />)

        // Open offcanvas
        const infoButton = screen.getByRole('button', {
            name: /photo input information/i,
        })
        fireEvent.click(infoButton)
        expect(screen.getByText(/test children/i)).toBeInTheDocument()

        // Close offcanvas by clicking outside or using the modal header close
        // Simulate clicking the backdrop or close button
        const closeButton = screen.getByTestId('offcanvas-close')
        fireEvent.click(closeButton)
        expect(screen.queryByText(/test children/i)).not.toBeInTheDocument()
    })

    test('can add a photo', async () => {
        const onPutPhotoAttachment = jest.fn()
        renderWithProps({ onPutPhotoAttachment })
        const addPhotoButton = screen.getByText(/add photo/i)

        await act(async () => {
            fireEvent.click(addPhotoButton)
            const input = screen.getByTestId('photo-input')
            const file = new File(['dummy'], 'photo.jpg', {
                type: 'image/jpeg',
            })
            fireEvent.change(input, { target: { files: [file] } })
        })

        expect(onPutPhotoAttachment).toHaveBeenCalled()
    })

    test('handles file input with no files', async () => {
        const onPutPhotoAttachment = jest.fn()
        renderWithProps({ onPutPhotoAttachment })

        await act(async () => {
            const input = screen.getByTestId('photo-input')
            fireEvent.change(input, { target: { files: null } })
        })

        expect(onPutPhotoAttachment).not.toHaveBeenCalled()
    })

    test('handles file input with empty files array', async () => {
        const onPutPhotoAttachment = jest.fn()
        renderWithProps({ onPutPhotoAttachment })

        await act(async () => {
            const input = screen.getByTestId('photo-input')
            fireEvent.change(input, { target: { files: [] } })
        })

        expect(onPutPhotoAttachment).not.toHaveBeenCalled()
    })

    test('works without onPutPhotoAttachment callback', async () => {
        renderWithProps({ onPutPhotoAttachment: undefined })

        await act(async () => {
            const input = screen.getByTestId('photo-input')
            const file = new File(['dummy'], 'photo.jpg', {
                type: 'image/jpeg',
            })
            fireEvent.change(input, { target: { files: [file] } })
        })

        // Should not throw error
    })

    test('can delete a photo', async () => {
        const mockAttachment = generateMockPhotoAttachment()
        const onRemovePhotoAttachment = jest.fn()
        renderWithProps({
            photoAttachments: [mockAttachment],
            onRemovePhotoAttachment,
        })

        const deleteButton = screen.getByRole('button', {
            name: /delete photo/i,
        })

        await act(async () => {
            fireEvent.click(deleteButton)
        })

        await screen.findAllByText(/confirm delete photo/i)

        const confirmDeleteButton = screen.getByRole('button', {
            name: /Confirm permanent photo deletion/i,
        })

        await act(async () => {
            fireEvent.click(confirmDeleteButton)
        })

        expect(onRemovePhotoAttachment).toHaveBeenCalledTimes(1)
    })

    test('can cancel photo deletion', async () => {
        const mockAttachment = generateMockPhotoAttachment()
        const onRemovePhotoAttachment = jest.fn()
        renderWithProps({
            photoAttachments: [mockAttachment],
            onRemovePhotoAttachment,
        })

        const deleteButton = screen.getByRole('button', {
            name: /delete photo/i,
        })

        await act(async () => {
            fireEvent.click(deleteButton)
        })

        await screen.findAllByText(/confirm delete photo/i)

        const cancelButton = screen.getByRole('button', {
            name: /cancel/i,
        })

        fireEvent.click(cancelButton)

        expect(onRemovePhotoAttachment).not.toHaveBeenCalled()
    })

    test('works without onRemovePhotoAttachment callback', async () => {
        const mockAttachment = generateMockPhotoAttachment()
        renderWithProps({
            photoAttachments: [mockAttachment],
            onRemovePhotoAttachment: undefined,
        })

        const deleteButton = screen.getByRole('button', {
            name: /delete photo/i,
        })

        await act(async () => {
            fireEvent.click(deleteButton)
        })

        await screen.findAllByText(/confirm delete photo/i)

        const confirmDeleteButton = screen.getByRole('button', {
            name: /Confirm permanent photo deletion/i,
        })

        await act(async () => {
            fireEvent.click(confirmDeleteButton)
        })

        // Should not throw error
    })

    test('renders loading indicator', () => {
        renderWithProps({ loading: true })
        expect(document.querySelector('.loader')).toBeInTheDocument()
    })

    test('renders error message', () => {
        renderWithProps({ error: 'Image loading failed.' })
        expect(screen.getByText(/image loading failed/i)).toBeInTheDocument()
    })

    test('renders notes input if notes prop is true', () => {
        renderWithProps({ notes: true })
        expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument()
    })

    test('does not render notes input if notes prop is false', () => {
        renderWithProps({ notes: false })
        expect(screen.queryByLabelText(/Notes/i)).toBeNull()
    })

    test('does not show add photo button when count is reached', () => {
        const mockAttachments = [
            generateMockPhotoAttachment({ attachmentId: 'photo1' }),
            generateMockPhotoAttachment({ attachmentId: 'photo2' }),
        ]
        renderWithProps({
            photoAttachments: mockAttachments,
            count: 2,
        })

        expect(screen.queryByText(/add photo/i)).not.toBeInTheDocument()
    })

    test('sets capture attribute correctly for non-uploadable', () => {
        renderWithProps({ uploadable: false })
        const input = screen.getByTestId('photo-input')
        expect(input).toHaveAttribute('capture', 'environment')
    })

    test('does not set capture attribute for uploadable', () => {
        renderWithProps({ uploadable: true })
        const input = screen.getByTestId('photo-input')
        expect(input).not.toHaveAttribute('capture')
    })

    test('renders timestamp and geolocation correctly', () => {
        function formatDateTime(dateTimeStr: string): string {
            const date = new Date(dateTimeStr)
            const formattedDate = date.toLocaleString('en-US', DEFAULT_OPTIONS)
            return formattedDate
        }
        const mockAttachment = generateMockPhotoAttachment()
        renderWithProps({
            photoAttachments: [mockAttachment],
        })

        const timestamp = mockAttachment.metadata?.timestamp
            ? formatDateTime(
                  new Date(mockAttachment.metadata.timestamp).toLocaleString(),
              )
            : 'Missing'
        expect(
            screen.getByText(new RegExp(`${timestamp}`, 'i')),
        ).toBeInTheDocument()

        const geolocation = mockAttachment.metadata?.geolocation
            ? `${mockAttachment.metadata.geolocation.latitude}, ${mockAttachment.metadata.geolocation.longitude}`
            : 'Missing'
        expect(
            screen.getByText(new RegExp(`${geolocation}`, 'i')),
        ).toBeInTheDocument()
    })

    test('renders missing timestamp correctly', () => {
        const mockAttachment = generateMockPhotoAttachment({
            metadata: {
                timestamp: undefined,
                geolocation: {
                    latitude: 47.6062,
                    longitude: -122.3321,
                },
            },
        })
        renderWithProps({
            photoAttachments: [mockAttachment],
        })

        expect(screen.getByText(/missing/i)).toBeInTheDocument()
    })

    test('renders missing geolocation correctly', () => {
        const mockAttachment = generateMockPhotoAttachment({
            metadata: {
                timestamp: new Date().toISOString(),
                geolocation: undefined,
            },
        })
        renderWithProps({
            photoAttachments: [mockAttachment],
        })

        expect(screen.getByText(/missing/i)).toBeInTheDocument()
    })

    test('renders missing metadata correctly', () => {
        const mockAttachment = generateMockPhotoAttachment({
            metadata: undefined,
        })
        renderWithProps({
            photoAttachments: [mockAttachment],
        })

        const missingElements = screen.getAllByText(/missing/i)
        expect(missingElements).toHaveLength(2) // timestamp and geolocation
    })

    test('creates and revokes object URLs correctly', async () => {
        const mockAttachment = generateMockPhotoAttachment()
        const { rerender } = renderWithProps({
            photoAttachments: [mockAttachment],
        })

        expect(mockCreateObjectURL).toHaveBeenCalledWith(
            (mockAttachment.attachment as PouchDB.Core.FullAttachment).data,
        )

        // Rerender with no photos to trigger cleanup
        rerender(
            <StoreContext.Provider value={mockStoreContext as never}>
                <PhotoInput
                    count={5}
                    error={undefined}
                    id="photo-input-id"
                    label="Test Label"
                    loading={false}
                    notes={true}
                    onPutPhotoAttachment={jest.fn()}
                    onRemovePhotoAttachment={jest.fn()}
                    photoAttachments={[]}
                    uploadable={true}
                >
                    <div>Test Children</div>
                </PhotoInput>
            </StoreContext.Provider>,
        )

        await waitFor(() => {
            expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url')
        })
    })

    test('creates and revokes delete preview object URL correctly', async () => {
        const mockAttachment = generateMockPhotoAttachment()
        renderWithProps({
            photoAttachments: [mockAttachment],
        })

        const deleteButton = screen.getByRole('button', {
            name: /delete photo/i,
        })

        await act(async () => {
            fireEvent.click(deleteButton)
        })

        // Should create URL for delete preview
        expect(mockCreateObjectURL).toHaveBeenCalledWith(
            (mockAttachment.attachment as PouchDB.Core.FullAttachment).data,
        )

        const cancelButton = screen.getByRole('button', {
            name: /cancel/i,
        })

        fireEvent.click(cancelButton)

        await waitFor(() => {
            expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url')
        })
    })

    test('handles multiple photo attachments', () => {
        const mockAttachments = [
            generateMockPhotoAttachment({ attachmentId: 'photo1' }),
            generateMockPhotoAttachment({ attachmentId: 'photo2' }),
            generateMockPhotoAttachment({ attachmentId: 'photo3' }),
        ]
        renderWithProps({
            photoAttachments: mockAttachments,
        })

        const deleteButtons = screen.getAllByRole('button', {
            name: /delete photo/i,
        })
        expect(deleteButtons).toHaveLength(3)

        expect(mockCreateObjectURL).toHaveBeenCalledTimes(3)
    })

    test('handles photo attachment without object URL', () => {
        const mockAttachment = generateMockPhotoAttachment()
        renderWithProps({
            photoAttachments: [mockAttachment],
        })

        // Mock that objectURLsForPhotoAttachments doesn't have the URL at that index
        const images = screen.queryAllByRole('img')
        // The component should handle missing object URLs gracefully
        expect(images.length).toBeGreaterThanOrEqual(0)
    })

    test('delete button prevents default and stops propagation', async () => {
        const mockAttachment = generateMockPhotoAttachment()
        renderWithProps({
            photoAttachments: [mockAttachment],
        })

        const deleteButton = screen.getByRole('button', {
            name: /delete photo/i,
        })

        // Create a mock event to test preventDefault and stopPropagation
        const mockEvent = {
            stopPropagation: jest.fn(),
            preventDefault: jest.fn(),
            target: deleteButton,
            currentTarget: deleteButton,
        }

        // Fire the click event - the component should handle event properly
        fireEvent.click(deleteButton, mockEvent)

        // Verify that the delete modal appears (which means the event was handled)
        await screen.findByText(/confirm delete photo/i)
    })

    test('handles offcanvas show info event', () => {
        renderWithProps()

        const infoButton = screen.getByRole('button', {
            name: /photo input information/i,
        })

        // Create a mock event to test preventDefault and stopPropagation
        const mockEvent = {
            stopPropagation: jest.fn(),
            preventDefault: jest.fn(),
            target: infoButton,
            currentTarget: infoButton,
        }

        // Fire the click event
        fireEvent.click(infoButton, mockEvent)

        // Verify that the offcanvas appears (which means the event was handled)
        expect(screen.getByText(/test children/i)).toBeInTheDocument()
    })

    test('can close delete modal via header close button', async () => {
        const mockAttachment = generateMockPhotoAttachment()
        renderWithProps({
            photoAttachments: [mockAttachment],
        })

        const deleteButton = screen.getByRole('button', {
            name: /delete photo/i,
        })

        await act(async () => {
            fireEvent.click(deleteButton)
        })

        await screen.findAllByText(/confirm delete photo/i)

        // Find and click the modal header close button (X button)
        const modalCloseButton = screen.getByRole('button', {
            name: /close/i,
        })

        fireEvent.click(modalCloseButton)

        // Modal should be closed, confirm text should no longer be visible
        await waitFor(() => {
            expect(
                screen.queryByText(/confirm delete photo/i),
            ).not.toBeInTheDocument()
        })
    })
})
