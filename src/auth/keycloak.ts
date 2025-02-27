let mockToken: string | null = null
let mockUserId: string | null = null

export const fetchUserId = async () => {
    try {
        const response = await fetch(
            'http://localhost:5000/api/users/email/maxine@test.com', // will need to change out with db url / user id var
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            },
        )

        const result = await response.json()

        console.log('API Response for User ID:', result)

        if (result.success && result.data && result.data.id) {
            mockUserId = result.data.id
            console.log('Fetched Test User ID:', mockUserId)
        } else {
            console.error(
                'Failed to fetch test user: Missing "id" field in response',
                result,
            )
        }
    } catch (error) {
        console.error('Error fetching test user:', error)
    }
}

export const generateMockToken = async () => {
    if (mockToken) return mockToken

    try {
        const response = await fetch(
            'http://localhost:5000/api/keycloak/api/get-keycloak-token', // NEED TO UPDATE TO DB URL
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            },
        )

        const result = await response.json()
        if (result.success && result.access_token) {
            mockToken = result.access_token
            console.log('Using Mock Token:', mockToken)
        } else {
            console.error('Failed to get mock token:', result)
        }
    } catch (error) {
        console.error('Error generating mock token:', error)
        mockToken = 'MOCK_ACCESS_TOKEN'
    }
}

export const getUserId = () => mockUserId
export const getAuthToken = () => mockToken
export const initializeMockSession = async () => {
    await fetchUserId()
    await generateMockToken()
}
