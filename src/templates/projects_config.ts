import PouchDB from 'pouchdb'
import dbName from '../components/db_details'

const db = new PouchDB(dbName)
const result = await db.allDocs({ include_docs: true })
const active_projects = result.rows.map(row => row.doc)

export default active_projects
