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

const md = `
<NumberInput label="Length (ft)" min={0} path="volume_calculator.length"  />
{props.doc.volume_calculator?.length}
`
// | Air Volume = {props.doc.volume_calculator?.length} x {props.doc.volume_calculator?.width} x {props.doc.volume_calculator?.height} = {props.doc.volume_calculator?.length * props.doc.volume_calculator?.width * props.doc.volume_calculator?.height} ft<sup>3</sup>


// const md = `# One number sign…`

// const data = compileSync(md,{})
// console.log('md data:',data)
// const compiledRun = runSync(data,{})
// console.log('compiled:',compiledRun)
// const {default: Content}  = evaluateSync(md, {
//   ...provider,
//   Fragment: _Fragment,
//   jsx: _jsx,
//   jsxs: _jsxs,
//   useMDXComponents,
//   useDynamicImport: true
// })
// console.log("evaluated data:", Content)




const EditorFlexBox: FC = () => {
  function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
  }
  
  const [text, setText] = useState('');
  // useEffect(() => {
  //   const code = runSync(text, runtime)
  //   console.log(code);
  // })
  let {default: Content}  = evaluateSync(md, {
    ...provider,
    Fragment: _Fragment,
    jsx: _jsx,
    jsxs: _jsxs,
    useMDXComponents,
    useDynamicImport: true
  })

  let foobar  = evaluateSync(md, {
    ...provider,
    Fragment: _Fragment,
    jsx: _jsx,
    jsxs: _jsxs,
    useMDXComponents,
    useDynamicImport: true
  })
  
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    // setText(event.target.value);
    event.target.style.height = 'auto'; // Reset the height to auto to adjust the size
    event.target.style.height = `${event.target.scrollHeight}px`; // Set the height to the scrollHeight to adjust the size
    const result = evaluateSync(text, {
      ...provider,
      Fragment: _Fragment,
      jsx: _jsx,
      jsxs: _jsxs,
      useMDXComponents,
      useDynamicImport: true
    })
    Content = result.default;
    
  };
  const components = {
    Collapsible,
    DateInput: DateInputWrapper,
    Figure: FigureWrapper,
    NumberInput: NumberInputWrapper,
    // Photo: PhotoWrapper,
    PhotoInput: PhotoInputWrapper,
    PrintSection,
    Select: SelectWrapper,
    StringInput: StringInputWrapper,
    // table: TableWrapper,
    // TextInput: TextInputWrapper,
    USStateSelect: USStateSelectWrapper,
    // DateStr: DateStr,
    Tab: Tab,
    Tabs: Tabs,
  };  

  return (
    <StoreContext.Consumer>
      {({doc}) => {
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
                  value={text}
                  onChange={handleChange}
                  style={{ height: 'auto', minHeight: '700px', resize: 'none' }}
                />
              <button disabled={!text} onClick={() => setText(text)}>Submit</button>
            </div>
          </div>
          <div className="flex-child">
            {text}
            <StoreProvider dbName='template_editor' docId={'playground' as string}>
                Content Code: <Content components={components} doc={doc}/>
            </StoreProvider>
          </div>
      </div>          
      </div>
        )
      }}
    </StoreContext.Consumer>

      // <div className="flex-container">
      //     <div className="flex-child">
      //       <div className="form-group" >
      //         <label>textarea</label>
      //           <textarea
      //             className='form-control'
      //             id="message"
      //             name="message"
      //             value={text}
      //             onChange={handleChange}
      //             style={{ height: 'auto', minHeight: '700px', resize: 'none' }}
      //           />
      //         <button disabled={!text}>Submit</button>
      //       </div>
      //     </div>
      //     <div className="flex-child">
      //       <StoreProvider dbName='template_editor' docId={'playground' as string}>
      //           Content Code: <Content components={components}/>
      //       </StoreProvider>
      //     </div>
      // </div>
  );
};

export default EditorFlexBox;