export async function putNewDoc(db : PouchDB.Database<{}>, name:string, date:Date) {
    db.putIfNotExists(name, {metadata_:{created_at: date, last_modified_at: date, attachments: {}}})
}