import {FC} from 'react'
import { StoreContext, StoreProvider } from './store';
import { useEffect, useState } from 'react';
import {evaluateSync} from '@mdx-js/mdx'
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from 'react/jsx-runtime'
import * as provider from '@mdx-js/react'
import { useMDXComponents } from '@mdx-js/react';
import Collapsible from './collapsible';
import DateInputWrapper from './date_input_wrapper';
import DateStr from './date';
import FigureWrapper from './figure_wrapper';
import NumberInputWrapper from './number_input_wrapper';
import PhotoInput from './photo_input';
import PhotoInputWrapper from './photo_input_wrapper';
import PhotoWrapper from './photo_wrapper';
import PrintSection from './print_section';
import SelectWrapper from './select_wrapper';
import StringInput from './string_input';
import StringInputWrapper from './string_input_wrapper';
import Tab from 'react-bootstrap/Tab'
import TableWrapper from './table_wrapper';
import Tabs from 'react-bootstrap/Tabs'
import TextInput from './text_input';
import TextInputWrapper from './text_input_wrapper';
import USStateSelectWrapper from './us_state_select_wrapper';
import ErrorBoundary from './error_boundary';

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

let initialTemplateText = `
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

function generateTemplateView(templateText: string) {
  let MDXContent;
  try {
    MDXContent = evaluateSync(templateText, {
      ...provider,
      Fragment: _Fragment,
      jsx: _jsx,
      jsxs: _jsxs,
      useMDXComponents,
      useDynamicImport: true
    })
  } catch{
    // Error generating MDX, so use initial text (it should compile successfully)
    console.log("Error in generation method. Using Fallback")
    MDXContent = evaluateSync(initialTemplateText, {
      ...provider,
      Fragment: _Fragment,
      jsx: _jsx,
      jsxs: _jsxs,
      useMDXComponents,
      useDynamicImport: true
    })
  }
  return MDXContent
}

const MDXContentFallback = generateTemplateView('Syntax Error in MDX');
let MDXContent = MDXContentFallback.default;
const EditorFlexBox: FC = () => {
  let savedTemplateText = localStorage.getItem("templateText");
  if (savedTemplateText) {
    initialTemplateText = savedTemplateText;
  }
  const [templateText, setTemplateText] = useState(initialTemplateText);
  const [mdxComponent, setMdxComponent] = useState(generateTemplateView(initialTemplateText))
  const handleButtonClick = () => {
    // Example to see what happens if I throw an arbitrary error
    try {
      throw new Error("error")
    } catch (e) {
      console.log("error caught")
    }
    localStorage.setItem("templateText",templateText)
    try {
      setMdxComponent(generateTemplateView(templateText));
    } catch{
      // Error generating MDX, so use initial text (it should compile successfully)
      console.log("error generating mdx")
      setMdxComponent(generateTemplateView(initialTemplateText));
    }
  }
  try {
    MDXContent = mdxComponent.default
  } catch {
    // Error saving the generated MDX component, so use fallback component (it should exist and be renderable)
    console.log('using fallback content')
    MDXContent = MDXContentFallback.default
  }
  useEffect(() => {    
    try {
      MDXContent = mdxComponent.default
    } catch {
      // Error saving the generated MDX component, so use fallback component (it should exist and be renderable)
      console.log('using fallback content')
      MDXContent = MDXContentFallback.default
    }  
  }, [])

  return (
    <StoreProvider dbName='template_editor' docId={'playground' as string}>
      <StoreContext.Consumer>
        {({doc}) => {
          return (
            <ErrorBoundary>
            <div className="container" id="mdx-container">
              <div className="flex-container">
                <div className="flex-child">
                  <div className="form-group" >
                    <label>textarea</label>
                    <textarea
                      className='form-control'
                      id="message"
                      name="message"
                      value={templateText}
                      onChange={e => setTemplateText(e.target.value)} 
                      style={{ height: 'auto', minHeight: '700px', resize: 'none' }}
                    />
                      <button type="submit" onClick={handleButtonClick}>Submit</button>
                  </div>
                </div>
                <div className="flex-child">
                  Content Code:
                  <MDXContent components={components} doc={doc}/>}
                </div>
              </div>          
            </div>
            </ErrorBoundary>
          )
        }}
      </StoreContext.Consumer>
    </StoreProvider>
  );
};

export default EditorFlexBox;