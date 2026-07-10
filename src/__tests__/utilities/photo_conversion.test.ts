import { blobFromAttachmentData } from '../../utilities/json_serialization_utils'

// Mock heic2any since it's not available in Jest environment
jest.mock('heic2any', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('Photo Conversion Utilities', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('blobFromAttachmentData', () => {
        it('should handle Blob data directly', () => {
            const originalBlob = new Blob(['test data'], { type: 'image/jpeg' })
            const result = blobFromAttachmentData(originalBlob, 'image/jpeg')

            expect(result).toBe(originalBlob)
            expect(result?.type).toBe('image/jpeg')
        })

        it('should convert base64 string to Blob', () => {
            const testString = 'Hello, World!'
            const base64Data = btoa(testString)
            const result = blobFromAttachmentData(base64Data, 'text/plain')

            expect(result).toBeDefined()
            expect(result?.type).toBe('text/plain')
            expect(result?.size).toBeGreaterThan(0)
        })

        it('should use default content type when not provided', () => {
            const base64Data = btoa('test')
            const result = blobFromAttachmentData(base64Data)

            expect(result?.type).toBe('application/octet-stream')
        })

        it('should return undefined for undefined input', () => {
            const result = blobFromAttachmentData(undefined)
            expect(result).toBeUndefined()
        })

        it('should preserve content type through conversion', () => {
            const base64Data = btoa('photo data')
            const result = blobFromAttachmentData(base64Data, 'image/png')

            expect(result?.type).toBe('image/png')
        })
    })

    describe('Photo conversion utilities', () => {
        it('should have proper environment setup', () => {
            // Verify the test environment is set up correctly
            expect(typeof Blob).toBe('function')
            expect(typeof Uint8Array).toBe('function')
            expect(btoa).toBeDefined()
            expect(atob).toBeDefined()
        })

        it('should encode/decode base64 correctly', () => {
            const originalText = 'test photo data'
            const encoded = btoa(originalText)
            const decoded = atob(encoded)

            expect(decoded).toBe(originalText)
        })
    })
})
