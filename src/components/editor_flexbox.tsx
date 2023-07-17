import { evaluateSync } from '@mdx-js/mdx'
import * as provider from '@mdx-js/react'
import { useMDXComponents } from '@mdx-js/react'
import type { FC } from 'react'
import React, { useState } from 'react'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import ClimateZoneSelectWrapper from './climate_zone_select_wrapper'
import Collapsible from './collapsible'
import DateInputWrapper from './date_input_wrapper'
import DateStr from './date_str'
import DisplayErrorErrorBoundary from './display_error_error_boundary'
import FigureWrapper from './figure_wrapper'
import NumberInputWrapper from './number_input_wrapper'
import PhotoInputWrapper from './photo_input_wrapper'
import PhotoWrapper from './photo_wrapper'
import PrintSection from './print_section'
import RadioWrapper from './radio_wrapper'
import SelectWrapper from './select_wrapper'
import { StoreContext, StoreProvider } from './store'
import StringInputWrapper from './string_input_wrapper'
import TableWrapper from './table_wrapper'
import TextInputWrapper from './text_input_wrapper'
import USStateSelectWrapper from './us_state_select_wrapper'

const components = {
  Collapsible,
  ClimateZoneSelect: ClimateZoneSelectWrapper,
  DateInput: DateInputWrapper,
  Figure: FigureWrapper,
  NumberInput: NumberInputWrapper,
  Photo: PhotoWrapper,
  PhotoInput: PhotoInputWrapper,
  PrintSection,
  Radio: RadioWrapper,
  Select: SelectWrapper,
  StringInput: StringInputWrapper,
  Table: TableWrapper,
  TextInput: TextInputWrapper,
  USStateSelect: USStateSelectWrapper,
  DateStr: DateStr,
  Tab: Tab,
  Tabs: Tabs
}

let initialTemplateText = `
<br></br>
<PrintSection label='Print Report'>
<Collapsible header='Collapsible — Instructions'>
    Here is an example of a collapsible component
    1. First item
    2. Second item
    3. Third item
</Collapsible>
<Figure src='/images/hpwh/hpwh_components.jpeg'>
  The components in a common HPWH (BASC 2015)
</Figure>
<PhotoInput id='photo_input' label='Photo Input'>
  Provide a photo
</PhotoInput>
<NumberInput label='Number Input' min={0} path='number_input.value'  />
Value:{props.doc.number_input?.value}
<StringInput label='String Input' path='string_input.value' />
Value:{props.doc.string_input?.value}
</PrintSection>
<USStateSelect label='State' path='state_select.value' />
Value:{props.doc.state_select?.value}
`

function generateTemplateView (templateText: string): any {
  let MDXModule
  try {
    MDXModule = evaluateSync(templateText, {
      ...provider,
      Fragment: _Fragment,
      jsx: _jsx,
      jsxs: _jsxs,
      useMDXComponents,
      useDynamicImport: true
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('error log:', error.message)
    }
    throw new Error('Error evaluating MDX')
  }
  return MDXModule
}

const EditorFlexBox: FC = () => {
  const savedTemplateText = localStorage.getItem('templateText')
  if (savedTemplateText != null) {
    initialTemplateText = savedTemplateText
  }

  const [templateText, setTemplateText] = useState(initialTemplateText)
  const [, setHasError] = useState(false)
  const [mdxModule, setMdxModule] = useState(generateTemplateView(initialTemplateText))
  const handleButtonClick = (): void => {
    try {
      setMdxModule(generateTemplateView(templateText))
      localStorage.setItem('templateText', templateText)
      setHasError(false)
    } catch {
      setHasError(true)
    }
  }

  const handleSetText = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTemplateText(event.currentTarget.value)
    try {
      setMdxModule(generateTemplateView(templateText))
      localStorage.setItem('templateText', templateText)
      setHasError(false)
    } catch {
      setHasError(true)
    }
  }

  const MDXComponent = mdxModule.default

  return (
    <StoreProvider dbName='template_editor' docId={'playground'}>
      <StoreContext.Consumer>
        {({ data }) => {
          return (
            <div className='container' id='mdx-container'>
              <div className='flex-container'>
                <div className='flex-child'>
                  <div className='form-group'>
                    <textarea
                      className='form-control'
                      id='message'
                      name='message'
                      value={templateText}
                      onChange={handleSetText}
                      style={{
                        height: 'auto',
                        minHeight: '700px',
                        resize: 'none'
                      }}
                    />
                    <button type='submit' onClick={handleButtonClick}>
                      Re-Render
                    </button>
                  </div>
                </div>
                <div className='flex-child'>
                  <div className='flex-child'>
                    <DisplayErrorErrorBoundary>
                      <MDXComponent components={components} doc={data} />
                    </DisplayErrorErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      </StoreContext.Consumer>
    </StoreProvider>
  )
}

export default EditorFlexBox
