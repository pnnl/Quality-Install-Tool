import PouchDB from 'pouchdb'
import dbName from '../components/db_details'

/* Retrieves the updated project doc from the pouch DB
- Used in the App.tsx to populate the routes accordingly when new project is created 
*/
const db = new PouchDB(dbName)
const result = await db.allDocs({ include_docs: true })
const active_projects = result.rows.map(row => row.doc)

export default active_projects
