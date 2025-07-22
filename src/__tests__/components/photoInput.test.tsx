// Command to run this test: yarn test src/__tests__/components/photoInput.test.tsx

// Test suite for PhotoInput component
import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { DEFAULT_OPTIONS } from '../../components/date_time_str'
import PhotoInput, { PhotoInputProps } from '../../components/photo_input'
import React from 'react'
import { StoreContext } from '../../providers/store_provider'
import { type PhotoAttachment } from '../../utilities/photo_attachment_utils'

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn()
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
    useMergedRefs: jest.fn((ref1, ref2) => ref1),
}))

// Mock react-bootstrap Offcanvas component completely with sub-components
jest.mock('react-bootstrap/Offcanvas', () => {
    const MockOffcanvas = ({ children, show, onHide, ...props }: any) => {
        if (!show) return null
        return (
            <div data-testid="mock-offcanvas" {...props}>
                {children}
            </div>
        )
    }

    MockOffcanvas.Header = ({ children, closeButton, ...props }: any) => (
        <div data-testid="offcanvas-header" {...props}>
            {children}
            {closeButton && (
                <button onClick={props.onHide} data-testid="offcanvas-close">
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

const mockStoreContext = {
    docId: 'TestDocID123',
    attachments: {},
    metadata: {},
}

const generateMockPhotoAttachment = (): PhotoAttachment => ({
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
})

describe('PhotoInput Component', () => {
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
            <StoreContext.Provider value={mockStoreContext as never}>
                <PhotoInput {...defaultProps} {...props} />
            </StoreContext.Provider>,
        )
    }

    test('renders label and children', () => {
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

        await screen.findAllByText(/confirm delete photo/i) // Wait for modal to appear

        const confirmDeleteButton = screen.getByRole('button', {
            name: /Confirm permanent photo deletion/i,
        })

        await act(async () => {
            fireEvent.click(confirmDeleteButton)
        })

        expect(onRemovePhotoAttachment).toHaveBeenCalledTimes(1)
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

        // Check if timestamp is displayed correctly
        const timestamp = mockAttachment.metadata?.timestamp
            ? formatDateTime(
                  new Date(mockAttachment.metadata.timestamp).toLocaleString(),
              )
            : 'Missing'

        expect(
            screen.getByText(new RegExp(`${timestamp}`, 'i')),
        ).toBeInTheDocument()

        // Check if geolocation is displayed correctly
        const geolocation = mockAttachment.metadata?.geolocation
            ? `${mockAttachment.metadata.geolocation.latitude}, ${mockAttachment.metadata.geolocation.longitude}`
            : 'Missing'
        expect(
            screen.getByText(new RegExp(`${geolocation}`, 'i')),
        ).toBeInTheDocument()
    })
})
