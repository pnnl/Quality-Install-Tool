import {Component, FC} from 'react'
import EditorFlexBox from "./editor_flexbox"
import { StoreContext } from './store'

const TemplateEditor: FC = () => {    
  return (
    // Note: docId is guaranteed to be a string because this component is only
    // used when the :docId dynamic route segment is set.
    <div>
      <h1>Editor</h1>
        <EditorFlexBox />
    </div>
  ) 
}

export default TemplateEditor