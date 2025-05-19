const express = require('express');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const app = express();
const port = process.env.CONFIG_PORT || 3001;

const client = new SecretsManagerClient({ region: process.env.REACT_APP_AWS_REGION });

app.get('/config', async (req, res) => {
  try {
    const command = new GetSecretValueCommand({ SecretId: process.env.REACT_APP_SECRET_ID });
    const response = await client.send(command);
    const secrets = JSON.parse(response.SecretString);
    res.json({
      REACT_APP_VAPORCORE_URL: secrets.REACT_APP_VAPORCORE_URL,
      REACT_APP_AWS_S3_BUCKET: secrets.REACT_APP_AWS_S3_BUCKET,
      REACT_APP_AWS_S3_BUCKET_USER_KEY: secrets.REACT_APP_AWS_S3_BUCKET_USER_KEY,
      REACT_APP_AWS_S3_BUCKET_USER_SECRET: secrets.REACT_APP_AWS_S3_BUCKET_USER_SECRET,
      REACT_APP_AWS_S3_KMS_KEY_ID: secrets.REACT_APP_AWS_S3_KMS_KEY_ID,
      REACT_APP_AWS_REGION: secrets.REACT_APP_AWS_REGION,
      REACT_APP_VAPORFLOW_URL: secrets.REACT_APP_VAPORFLOW_URL
    });
  } catch (err) {
    console.error('Error fetching secret:', err);
    res.status(500).json({ error: 'Failed to load config' });
  }
});

app.listen(port, () => {
  console.log(`Config server listening on port ${port}`);
});
