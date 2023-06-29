import PouchDB from 'pouchdb'
import PouchDBUpsert from 'pouchdb-upsert'
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";

import { isEmpty, isUndefined, toPath } from 'lodash'
import JSONValue from '../types/json_value.type'
import {getPhotoMetadata} from '../utilities/photo_utils'
import { isEmptyBindingElement } from 'typescript';
import Attachment from '../types/attachment.type'
import type {Objectish, AnyObject, AnyArray, NonEmptyArray} from '../types/misc_types.type'
import Metadata from '../types/metadata.type';

PouchDB.plugin(PouchDBUpsert)

interface UpsertAttachment {
  (blob: Blob, id: string): void;
}

interface UpsertData {
  (pathStr: string, data: any): void;
}

interface UpsertDoc{
  (pathStr: string, data: any): void;
}

export const StoreContext = React.createContext({
  attachments:  {} as Record<string, {blob: Blob, metadata: Record<string, JSONValue>}>,
  data: {} as JSONValue,
  
  metadata: {} as any,
  upsertAttachment: ((blob: Blob, id: any) => {}) as UpsertAttachment,
  upsertData: ((pathStr: string, data: any) => {}) as UpsertData,
  upsertDoc: ((pathStr: string, data: any) => {}) as UpsertDoc,
});


interface StoreProviderProps {
  children: ReactNode;
  dbName: string,
  docId: string,
}

/**
 * A wrapper component that connects its children to a data store via React Context
 * 
 * @param children - The content wrapped by this component
 * @param dbName - Database name associated with an MDX template
 * @param docId - Document instance id
 */
export const StoreProvider: FC<StoreProviderProps> = ({ children, dbName, docId }) => {
  const changesRef = useRef<PouchDB.Core.Changes<{}>>();
  const revisionRef = useRef<string>();
  // The attachments state will have the form: {[att_id]: {blob, digest, metadata}, ...}
  const [attachments, setAttachments] = useState<Record<string, Attachment>>({});
  const [db, setDB] = useState<PouchDB.Database>();
  // The doc state could be anything that is JSON-compatible
  const [doc, setDoc] = useState({});
  const [data, setData] = useState({});
  const [metadata, setMetaData] = useState({});

  /**
   * Updates component state based on a database document change
   * 
   * @param dbDoc The full object representation of the changed document from the database
   */
  async function processDBDocChange(db: PouchDB.Database, dbDoc: PouchDB.Core.IdMeta & PouchDB.Core.GetMeta & {data_: {}} & {metadata_: Metadata}) {
    console.log('processDBDocChange2')
    console.log('dbDoc:', dbDoc)
    revisionRef.current = dbDoc._rev

    // Set doc state
    const newDoc: Partial<typeof dbDoc> = {...dbDoc}
    delete newDoc._attachments
    delete newDoc._id
    delete newDoc._rev

    setDoc(newDoc)
    if (db && dbDoc.hasOwnProperty("data_")) {
    
    setData(dbDoc.data_)
    }

    if (db && dbDoc.hasOwnProperty("metadata_")) {
      setMetaData (dbDoc.metadata_)
    }

    // Update the attachments state as needed
    // Note: dbDoc will not have a _attachments field if the document has no attachments
    if (db && dbDoc.hasOwnProperty("_attachments")) {
      console.log('dbDoc has _attachments')
      // Collect all the new or modified attachments
      const dbDocAttachments = dbDoc._attachments
      const attachmentsMetadata = dbDoc.metadata_.attachments
      let newAttachments: Record<string, Attachment> = {}
      for (const attachmentId in dbDocAttachments) {
        const docAttachment = dbDocAttachments[attachmentId]
        const singleAttachmentMetadata = attachmentsMetadata[attachmentId]
        // digest is a hash of the attachment, so a different digest indicates a modified attachment
        const digest = docAttachment.digest
        if (digest && (!attachments.hasOwnProperty(attachmentId) || attachments[attachmentId].digest != digest)) {
          console.log('New attachment')
          // This is a new or modified attachment, so build a new attachment for state
          const blobOrBuffer = await db.getAttachment(docId, attachmentId)
          
          if (blobOrBuffer instanceof Blob) {
            const blob = blobOrBuffer
            //const metadata = blob.type === 'image/jpeg' ? getPhotoMetadata(blob) : {}
            // Fetching the SingleAttachmentMetadata from DB
            const metadata = blob.type == 'image/jpeg'  ? singleAttachmentMetadata : {} 
            
            newAttachments = {
              ...newAttachments,
              [attachmentId]: {
                blob,
                digest,
                metadata,
              }
            }
          } else {
            throw new Error('Attachment must be a Blob')
          }
        } 
      }
      if (!isEmpty(newAttachments)) {
        console.log('newAttachments:', newAttachments)
        // Update the attachments state
        // Note: We update all new attachments at once to avoid a race condition with state update
        setAttachments({...attachments, ...newAttachments})
      }
    }
  }

  useEffect(() => {

    /**
     * Connects the store to the database document
     *
     * @remarks
     * This is an IIFE (Immediately Invoked Function Expression) that 
     * (1) Establishes a database connection
     * (2) Initializes the database document if it does not already exist
     * (3) Initializes the doc and attachments state from the database document
     * (4) Subscribes to future changes to the database document — it ignores changes that
     *     originated from this component
     */
    (async function connectStoreToDB() {
      // Establish a database connection
      const db = new PouchDB(dbName, {auto_compaction: true})
      setDB(db)

      // Initialize the DB document as needed
      try {
        // It looks like the type def for putIfNotExists does not match its implementation
        // TODO: Check this over carefully
        const date = new Date()
        const result = await db.putIfNotExists(docId, {metadata_:{created_at: date, last_modified_at: date, attachments : {}}})
        revisionRef.current = result.rev
      } catch(err) {
        console.error('DB initialization error:', err)
        // TODO: Rethink how best to handle errors
      }

      // Initialize doc and attachments state from the DB document
      try {
        const dbDoc = await db.get(docId)
        processDBDocChange(db, dbDoc)
      } catch(err) {
        console.error('Unable to initialize state from DB:', err)
      }

      // Subscribe to DB document changes
      changesRef.current = db.changes({
        include_docs: true,
        live: true,
        since: 'now',
      }).on('change', function (change) {
        console.log('Database changed')
        console.log('_rev:', change.doc?._rev)
        console.log('current:', revisionRef.current)
        if (change.doc && change.doc._rev !== revisionRef.current) {
          // The change must have originated from outside this component, so update component state
          console.log('processing DB change')
          processDBDocChange(db, change.doc)
        }
        // else: the change originated from this component, so ignore it
      }).on('error', function (err) {
        // It's hard to imagine what would cause this since our DB is local
        console.error('DB subscription connection failed')
      });

    })()

    // Cancel the DB subscription just before the component unmounts
    return () => {
      if (changesRef.current) {
        changesRef.current.cancel()
      }
    }
  
    // Run this effect after the first render and whenever the dbName prop changes
  }, [dbName])


  /**
   * Updates (or inserts) data into the doc state and persists the new doc
   * 
   * @remarks
   * The given path is gauranteed to exist after the update/insertion.
   * This function is called internally from upsertData and upsertAttachments function to update the doc with respective information.
   * 
   * @param pathStr A string path such as "foo.bar[2].biz" that represents a path into the doc state
   * @param data The data that is to be updated/inserted at the path location in the doc state
   */
  const upsertDoc = (pathStr: string, data: any) => {
    // Update doc state
    const newDoc = immutableUpsert(doc, toPath(pathStr) as NonEmptyArray<string>, data)
    setDoc(newDoc);

    // Persist the doc
    if (db) {
      db.upsert(docId, function upsertFn(dbDoc: any) {
        let result = {...dbDoc, ...newDoc};
        if (!result.metadata_) {
          result.metadata_ = {
              created_at: new Date(),
              last_modified_at: new Date()
          };
        } else {
          result.metadata_.last_modified_at = new Date();
        }
        return result;
      }).then(function (res) {
        if (pathStr.indexOf("metadata_") > -1)
            revisionRef.current = res.rev
        }).catch(function (err : Error) {
        console.error('upsert error:', err)
      })
    }

  };


  /**
   * Updates (or inserts) data into the data_ state by invoking updatedDoc function
   * 
   * @remarks
   * This function is typically passed to an input wrapper component via the StoreContext.Provider value
   * This function calls updateDoc, with the path to "data_" in dbDoc.
   * 
   * @param pathStr A string path such as "foo.bar[2].biz" that represents a path into the doc state
   * @param data The data that is to be updated/inserted at the path location in the data state
   */
  const upsertData = (pathStr:string, data:any) => {
    
    pathStr = "data_."+pathStr
    upsertDoc(pathStr, data)
    
  }
  /**
   * 
   * @param blob 
   * @param id 
   */
  const upsertAttachment: UpsertAttachment = async (blob, id: string) => {
    // Create the metadata for the blob  
   const metadata: Attachment["metadata"] = (
      blob.type === "image/jpeg" ? await getPhotoMetadata(blob) :  {}
    )

    // Storing SingleAttachmentMetaData in the DB 
    upsertDoc("metadata_.attachments."+id, metadata)
      
    // Store the blob in memory
    const newAttachments = {
      ...attachments,
      [id]: {
        blob,
        metadata,
      }
    }
    setAttachments(newAttachments) 

    // Persist the blob
    const upsertBlobDB = async (rev: string): Promise<PouchDB.Core.Response | null> => {
      let result = null
      if (db) {
        try {
          result = await db.putAttachment(docId, id, rev, blob, blob.type)
        } catch(err) {
          // Try again with the latest rev value
          const doc = await db.get(docId)
          result = await upsertBlobDB(doc._rev)
        } finally {
          if (result) {
            revisionRef.current = result.rev
          }
        }

      }
      return result
    }
   

    if (revisionRef.current) {
      upsertBlobDB(revisionRef.current)
    }
  };

  return (
    <StoreContext.Provider value={{attachments,  data, metadata, upsertAttachment, upsertData}}>
      {children}
    </StoreContext.Provider>
  );
};

/**
 * Immutably updates/inserts a target value at a given path
 * @param recipient 
 * @param path 
 * @param target 
 * @returns A shallow copy of recipient that additionally has the value at path set to target
 */
function immutableUpsert(recipient: Objectish, path: NonEmptyArray<string>, target: any): Objectish {
  const [propName, ...newPath] = path;
  const newRecipient = (typeof recipient === 'object') ? (Array.isArray(recipient) ? [...recipient] : {...recipient}) : (isNaN(parseInt(propName)) ? {} : []);
  if (newPath.length === 0) {
    newRecipient[propName] = target;
  } else {
    // @ts-expect-error    
    newRecipient[propName] = immutableUpsert(newRecipient[propName], newPath, target);
  }
  return newRecipient;
}