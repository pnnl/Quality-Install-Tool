import { get } from 'lodash'
import React, {FC} from 'react'
import {useParams} from 'react-router-dom'

import {StoreContext, StoreProvider} from './store'

interface JsonStoreViewProps {
  dbName: string,
}

/**
 * A component that provides a simple JSON view of the data store
 * 
 * @remarks
 * The document Id for the instance is taken from a dynamic segment
 * of the route, :docId. 
 * 
 * @param dbName - The database name associated with an MDX template
 */
const JsonStoreView: FC<JsonStoreViewProps> = ({dbName}) => {
  const {docId} = useParams();

  return docId && (
    <StoreProvider dbName={dbName} docId={docId}>
      <StoreContext.Consumer>
        {({attachments, doc}) => {
            return (
              <>
                Document:
                <pre>{JSON.stringify(doc, null, 2)}</pre>

                Attachments:
                <pre>{JSON.stringify(attachments, null, 2)}</pre>
              </>
            )
          }
        }
      </StoreContext.Consumer>
    </StoreProvider>

)}


export default JsonStoreView
