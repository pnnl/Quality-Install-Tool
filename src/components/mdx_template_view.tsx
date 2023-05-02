import React, {FC} from 'react'
import {useParams} from 'react-router-dom'

import { StoreProvider } from "./store";
import MdxWrapper from "./mdx_wrapper"; 
import templatesConfig from '../templates/templates_config'

interface MdxTemplateViewProps {
  dbName: string,
}

/**
 * A component view of an instantiated MDX template
 *
 * @remarks
 * The document Id for the instance is taken from a dynamic segment
 * of the route, :docId.
 *
 * @param dbName - The database name associated with an MDX template
 */
const MdxTemplateView: FC<MdxTemplateViewProps> = ({dbName}) => {
  const {docId} = useParams();
  const config = templatesConfig[dbName]
  
  return (
    // Note: docId is guaranteed to be a string because this component is only
    // used when the :docId dynamic route segment is set.
    <StoreProvider dbName={dbName} docId={docId as string}>
      <MdxWrapper Component={config.template} />
    </StoreProvider>
  )
}

export default MdxTemplateView