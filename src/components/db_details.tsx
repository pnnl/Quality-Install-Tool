/**
 * Define the database name based on the deployment environment configured in AWS S3.
 * 
 * When deploying the application to AWS S3, the environment variable 'REACT_APP_ENV' 
 * is set to 'quality-install-tool' or 'ira-quality-install-tool' for the respective applications.
 * 
 * The environment variable can be accessed in code using the `process.env` object,
 * which will be populated with the specified value during the build process.
 * 
 * For Local dev environment, the env variable REACT_APP_ENV is set in 'package.json' 
 * in start script as below 
 * "scripts": {
    "start": "HTTPS=true REACT_APP_ENV=ira-quality-install-tool node scripts/start.js", 
    .... 
 *
 *
 * This `DBName` constant exports the value of `process.env.REACT_APP_ENV`, which will
 * determine the PouchDB database name created in the browser.
 * 
 * Example usage in code:
 * 
 * import DBName from './db_details'; 
 * console.log(`Using database: ${DBName}`); // Output will depend on the environment variable 'REACT_APP_ENV' set in the AWS S3 deployment.
 * 
 * Respective DBName exported are ('quality-install-tool' or 'ira-quality-install-tool').
 */

console.log(process.env.REACT_APP_ENV)
const DBName = process.env.REACT_APP_ENV
export default DBName
