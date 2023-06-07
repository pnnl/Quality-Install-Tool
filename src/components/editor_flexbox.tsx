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
import { StoreProvider } from './store';
import MdxWrapper from './mdx_wrapper';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import {run} from '@mdx-js/mdx'
import * as runtime from 'react/jsx-dev-runtime' // Development.


const md = `{1 + 1}`



const EditorFlexBox = () => {

  const [text, setText] = useState('');
  useEffect(() => {
    const code = run(text, runtime)
    console.log(code);
  })

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    event.target.style.height = 'auto'; // Reset the height to auto to adjust the size
    event.target.style.height = `${event.target.scrollHeight}px`; // Set the height to the scrollHeight to adjust the size
    
  };


  return (
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
            <button disabled={!text}>Submit</button>
          </div>
        </div>
        <div className="flex-child">
          <StoreProvider dbName='template_editor' docId={'playground' as string}>
            <Markdown children={md}></Markdown>
            {/* <p><Markdown children={text} options={{
              disableParsingRawHTML: true,
              overrides: {
                Tab: {
                  component: Tab,
                },
                Tabs: {
                  component: Tabs,
                },
                StringInput: {
                  component: StringInputWrapper,
                },
                TextInput: {
                  component: TextInput,
                },
                USStateSelect: {
                  component: USStateSelectWrapper,
                },
                PhotoInput: {
                  component: PhotoInputWrapper,
                },
                DataInput: {
                  component: DateInputWrapper,
                },
                NumberInput: {
                  component: NumberInputWrapper,
                },
                Collapse: {
                  component: Collapsible,
                },
                PrintSection: {
                  component: PrintSection,
                },
                Select: {
                  component: SelectWrapper,
                },
                Figure: {
                  component: FigureWrapper,
                }
              },
            }}/></p> */}
          </StoreProvider>
        </div>
    </div>
  );
};

export default EditorFlexBox;