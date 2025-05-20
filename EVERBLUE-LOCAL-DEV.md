# Overview

Our fork of the Quality Install Tool has the base React Frontend with an additional minimal Express backend running in the same container that's used to retreive secrets from AWS Secrets Manager. 

# Local Development

## Prerequisites 

- Use `.env.template` to create an `.env` file at the root of your repo. Use the configuration for the vapor-dev nc-secure s3 bucket. The Express server will read from your `.env` file for local environment rather than authenticating to AWS and pulling values down from Secrets Manager. 

- Requirements
    - Node.js 20+
    - Yarn (`npm install -g yarn`)

## Starting Up

1. Install frontend dependencies with yarn (see the base README.md for more info)
```bash
yarn install --frozen-lockfile
```

2. Install the backend dependencies with npm and start the Express Config server locally. This will emulate the `/config` endpoint that returns secrets from Secrets Manager in the deployed version.

```bash
cd server/
npm install
cd ..
node server/server.js
```

3. Open a new terminal and run the React frontend.

- The `yarn run start` command launches a server on localhost:3000 by default.
- You can (and should) set the port to something other than 3000 (vapor-flow), 3001 (vapor-quality express server), or 5000 (vapor-core) for local development by setting the `PORT` variable in your `.env` file. 
- The browser view will automatically update whenever any file within the `src` folder is modified and saved. 
- You must rerun `yarn run start` in order to see the effect of any changes made to files outside of the `src` folder. 
- This comes up if you make configuration changes in `config` or you change the resources in `public`.
