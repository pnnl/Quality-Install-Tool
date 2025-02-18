let accessToken: string | null = null

export const fetchAccessToken = async () => {
    try {
        const response = await fetch(
            'http://localhost:5000/api/get-keycloak-token',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )

        const result = await response.json()
        if (result.success && result.access_token) {
            accessToken = result.access_token
            console.log('New Keycloak Token:', accessToken)
        } else {
            console.error('Failed to fetch Keycloak token:', result)
        }
    } catch (error) {
        console.error('Error fetching Keycloak token:', error)
    }
}

export const getAuthToken = () => accessToken
