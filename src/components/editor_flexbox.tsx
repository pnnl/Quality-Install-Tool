import {FC} from 'react'

import Markdown from 'markdown-to-jsx';
import React, { ChangeEvent, useEffect, useState } from 'react';
import StringInput from './string_input';
import StringInputWrapper from './string_input_wrapper';
import USStateSelectWrapper from './us_state_select_wrapper';
import PhotoInput from './photo_input';
import PhotoInputWrapper from './photo_input_wrapper';
import DateInputWrapper from './date_input_wrapper';
import Collapsible from './collapsible';
import FigureWrapper from './figure_wrapper';
import NumberInputWrapper from './number_input_wrapper';
import PrintSection from './print_section';
import SelectWrapper from './select_wrapper';
import TextInput from './text_input';
import MdxTemplateView from '../components/mdx_template_view'
import { StoreContext, StoreProvider } from './store';
import MdxWrapper from './mdx_wrapper';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import {runSync, run} from '@mdx-js/mdx'
import {evaluateSync,EvaluateOptions,compileSync} from '@mdx-js/mdx'
// import {Fragment as _Fragment, jsx as _jsx} from 'react/jsx-runtime'
import * as runtime from 'react/jsx-runtime' // Development.
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from 'react/jsx-runtime'
import * as provider from '@mdx-js/react'
import { useMDXComponents } from '@mdx-js/react';
import PhotoWrapper from './photo_wrapper';
import TableWrapper from './table_wrapper';
import TextInputWrapper from './text_input_wrapper';
import DateStr from './date';

const components = {
  Collapsible,
  DateInput: DateInputWrapper,
  Figure: FigureWrapper,
  NumberInput: NumberInputWrapper,
  Photo: PhotoWrapper,
  PhotoInput: PhotoInputWrapper,
  PrintSection,
  Select: SelectWrapper,
  StringInput: StringInputWrapper,
  Table: TableWrapper,
  TextInput: TextInputWrapper,
  USStateSelect: USStateSelectWrapper,
  DateStr: DateStr,
  Tab: Tab,
  Tabs: Tabs,
};  


const EditorFlexBox: FC = () => {
  const initialState = `
  <br></br>
  <PrintSection label="Print Report">
  <Collapsible header="Collapsible — Instructions">
      Here is an example of a collapsible component
      1. First item
      2. Second item
      3. Third item
  </Collapsible>
  <Figure src="/images/hpwh/hpwh_components.jpeg">
    The components in a common HPWH (BASC 2015)
  </Figure>
  <PhotoInput id="photo_input" label="Photo Input">
    Provide a photo
  </PhotoInput>
  <NumberInput label="Number Input" min={0} path="number_input.value"  />
  Value:{props.doc.number_input?.value}
  <StringInput label="String Input" path="string_input.value" />
  Value:{props.doc.string_input?.value}
  </PrintSection>
  <USStateSelect label="State" path="state_select.value" />
  Value:{props.doc.state_select?.value}
  `
  const [textAreaContent, setTextAreaContent] = useState(initialState); // Declare a state variable...
  
  let {default: Content}  = evaluateSync(textAreaContent, {
    ...provider,
    Fragment: _Fragment,
    jsx: _jsx,
    jsxs: _jsxs,
    useMDXComponents,
    useDynamicImport: true
  })
   
  const handleChange = () => {
    const result = evaluateSync(textAreaContent, {
      ...provider,
      Fragment: _Fragment,
      jsx: _jsx,
      jsxs: _jsxs,
      useMDXComponents,
      useDynamicImport: true
    })
    Content = result.default;
  }
  return (
    <StoreProvider dbName='template_editor' docId={'playground' as string}>
      <StoreContext.Consumer>
        {({doc}) => {
          console.log("doc:", doc);
          return (
            <div className="container" id="mdx-container">
              <div className="flex-container">
                <div className="flex-child">
                  <div className="form-group" >
                    <label>textarea</label>
                    <textarea
                      className='form-control'
                      id="message"
                      name="message"
                      value={textAreaContent}
                      onChange={e => setTextAreaContent(e.target.value)} 
                      style={{ height: 'auto', minHeight: '700px', resize: 'none' }}
                    />
                    <button type="submit" onClick={handleChange}>Submit</button>
                  </div>
                </div>
                <div className="flex-child">
                      Content Code:
                      <Content components={components} doc={doc}/>
                </div>
              </div>          
            </div>
          )
        }}
      </StoreContext.Consumer>
    </StoreProvider>
  );
};

export default EditorFlexBox;