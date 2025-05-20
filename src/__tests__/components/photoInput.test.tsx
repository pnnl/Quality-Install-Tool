// Command to run this test: yarn test src/__tests__/components/photoInput.test.tsx

// Test suite for PhotoInput component
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { StoreContext } from '../../providers/store_provider'
import PhotoInput, { PhotoInputProps } from '../../components/photo_input'
import { type PhotoAttachment } from '../../utilities/photo_attachment_utils'
import { DEFAULT_OPTIONS } from '../../components/date_time_str'

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn()
// Mock heic2any
jest.mock('heic2any', () => ({ window: jest.fn() }))

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
            label: 'Test Label',
            uploadable: true,
            loading: false,
            error: undefined,
            count: 5,
            id: 'photo-input-id',
            notes: true,
            photoAttachments: [],
            onPutPhotoAttachment: jest.fn(),
            onRemovePhotoAttachment: jest.fn(),
            children: <div>Test Children</div>,
        }

        return render(
            <StoreContext.Provider value={mockStoreContext as any}>
                <PhotoInput {...defaultProps} {...props} />
            </StoreContext.Provider>,
        )
    }

    test('renders label and children', () => {
        renderWithProps()
        expect(screen.getByText(/test label/i)).toBeInTheDocument()
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
        expect(
            screen.getByLabelText(/optional note about photo\(s\)/i),
        ).toBeInTheDocument()
    })

    test('does not render notes input if notes prop is false', () => {
        renderWithProps({ notes: false })
        expect(
            screen.queryByLabelText(/optional note about photo\(s\)/i),
        ).toBeNull()
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
