import {Component, FC} from 'react'
import EditorFlexBox from "./editor_flexbox"

export default class TemplateEditor extends Component {
    render() {
    
    return (
      // Note: docId is guaranteed to be a string because this component is only
      // used when the :docId dynamic route segment is set.
      <div>
        <h1>Editor</h1>
          <EditorFlexBox />
      </div>
    ) 
    }
  }