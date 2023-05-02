import Markdown from 'markdown-to-jsx';
import React, { useState } from 'react';
import StringInput from './string_input';
import USStateSelectWrapper from './us_state_select_wrapper';
import PhotoInput from './photo_input';
import DateInputWrapper from './date_input_wrapper';
import Collapsible from './collapsible';
import FigureWrapper from './figure_wrapper';
import NumberInputWrapper from './number_input_wrapper';
import PrintSection from './print_section';
import SelectWrapper from './select_wrapper';
import TextInput from './text_input';

//const md = `<StringInput label="Street Address" path="location.street_address" /><StringInput label="City" path="location.city" /><USStateSelect label="State" path="location.state" />`



const EditorFlexBox = () => {

  const [text, setText] = useState('');

  const handleChange = (event) => {
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
            <p><Markdown children={text} options={{
            overrides: {
              StringInput: {
                component: StringInput,
              },
              TextInput: {
                component: TextInput,
              },
              USStateSelect: {
                component: USStateSelectWrapper,
              },
              PhotoInput: {
                component: PhotoInput,
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
        }}/></p>
        </div>
    </div>
  );
};

export default EditorFlexBox;