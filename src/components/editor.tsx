import {Component, FC} from 'react'
import EditorFlexBox from "./editor_flexbox"
import { StoreContext } from './store'

const TemplateEditor: FC = () => {    
  return (
    <div>
      <h1>Template Editor</h1>
        <EditorFlexBox />
    </div>
  ) 
}

export default TemplateEditor