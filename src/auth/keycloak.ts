let token: string | null = null

export const generateToken = async () => {
    if (token) return token

    try {
        const response = await fetch(
            `${process.env.REACT_APP_VAPORCORE_URL}/api/keycloak/api/get-keycloak-token`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            },
        )

        const result = await response.json()
        if (result.success && result.access_token) {
            token = result.access_token
            console.log('Using Token:', token)
        } else {
            console.error('Failed to get token:', result)
        }
    } catch (error) {
        console.error('Error generating token:', error)
    }
}

export const getAuthToken = () => token
export const initializeSession = async () => {
    await generateToken()
}