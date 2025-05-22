const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const {
    SecretsManagerClient,
    GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager')

const app = express()
const port = process.env.CONFIG_PORT || 3001

// only create client if needed (ECS)
let client = null
if (process.env.REACT_APP_SECRET_ID) {
    client = new SecretsManagerClient({
        region: process.env.REACT_APP_AWS_REGION,
    })
}

app.get('/config', async (req, res) => {
    try {
        let secrets

        if (client) {
            // for ECS, fetch secrets from secrets manager
            const command = new GetSecretValueCommand({
                SecretId: process.env.REACT_APP_SECRET_ID,
            })
            const response = await client.send(command)
            secrets = JSON.parse(response.SecretString)
            res.json({
                REACT_APP_VAPORCORE_URL: secrets.REACT_APP_VAPORCORE_URL,
                REACT_APP_AWS_S3_BUCKET: secrets.REACT_APP_AWS_S3_BUCKET,
                REACT_APP_AWS_S3_BUCKET_USER_KEY:
                    secrets.REACT_APP_AWS_S3_BUCKET_USER_KEY,
                REACT_APP_AWS_S3_BUCKET_USER_SECRET:
                    secrets.REACT_APP_AWS_S3_BUCKET_USER_SECRET,
                REACT_APP_AWS_S3_KMS_KEY_ID:
                    secrets.REACT_APP_AWS_S3_KMS_KEY_ID,
                REACT_APP_AWS_REGION: secrets.REACT_APP_AWS_REGION,
                REACT_APP_VAPORFLOW_URL: secrets.REACT_APP_VAPORFLOW_URL,
            })
            return
        } else {
            // use env vars for local dev
            res.json({
                REACT_APP_VAPORCORE_URL: process.env.REACT_APP_VAPORCORE_URL,
                REACT_APP_AWS_S3_BUCKET: process.env.REACT_APP_AWS_S3_BUCKET,
                REACT_APP_AWS_S3_BUCKET_USER_KEY:
                    process.env.REACT_APP_AWS_S3_BUCKET_USER_KEY,
                REACT_APP_AWS_S3_BUCKET_USER_SECRET:
                    process.env.REACT_APP_AWS_S3_BUCKET_USER_SECRET,
                REACT_APP_AWS_S3_KMS_KEY_ID:
                    process.env.REACT_APP_AWS_S3_KMS_KEY_ID,
                REACT_APP_AWS_REGION: process.env.REACT_APP_AWS_REGION,
                REACT_APP_VAPORFLOW_URL: process.env.REACT_APP_VAPORFLOW_URL,
            })
        }

    } catch (err) {
        console.error('Error fetching config:', err)
        res.status(500).json({ error: 'Failed to load config' })
    }
})

app.listen(port, () => {
    console.log(`Config server listening on port ${port}`)
})
