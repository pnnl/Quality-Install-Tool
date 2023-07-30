import print from 'print-js'
import React, {FC, ReactNode} from 'react'
import Button from 'react-bootstrap/Button'

import Collapsible from "./collapsible";
import DateInputWrapper from "./date_input_wrapper";
import FigureWrapper from "./figure_wrapper"
import NumberInputWrapper from "./number_input_wrapper";
import PhotoWrapper from "./photo_wrapper";
import PhotoInputWrapper from "./photo_input_wrapper";
import PrintSection from "./print_section";
import SelectWrapper from "./select_wrapper";
import StringInputWrapper from "./string_input_wrapper";
import TableWrapper from "./table_wrapper";
import TextInputWrapper from "./text_input_wrapper";
import USStateSelectWrapper from "./us_state_select_wrapper";
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import {StoreContext} from './store'
import DateStr from './date_str';
import ClimateZoneSelectWrapper from './climate_zone_select_wrapper';
import RadioWrapper from './radio_wrapper';
import PageBreak from './page_break';
import PrintSectionWrapper from './print_section_wrapper';


const components = {
  Collapsible,
  ClimateZoneSelect: ClimateZoneSelectWrapper,
  DateInput: DateInputWrapper,
  Figure: FigureWrapper,
  NumberInput: NumberInputWrapper,
  Photo: PhotoWrapper,
  PhotoInput: PhotoInputWrapper,
  PrintSection: PrintSectionWrapper,
  Radio: RadioWrapper,
  Select: SelectWrapper,
  StringInput: StringInputWrapper,
  table: TableWrapper,
  TextInput: TextInputWrapper,
  USStateSelect: USStateSelectWrapper,
  DateStr: DateStr,
  Tab: Tab,
  Tabs: Tabs,
  PageBreak: PageBreak,
};

interface MdxWrapperProps {
  Component: React.ComponentType<any>;
}

/**
 * A component that wraps an MDX component instance in order to tie it to the data store
 * and place it inside a bootstrap container
 * 
 * @param Component An MDX component instance
 */
const MdxWrapper: FC<MdxWrapperProps> = ({Component}) => {
  return (
    <StoreContext.Consumer>
      {({metadata, data}) => {
        return (
          <div className="container" id="mdx-container">
            {/* doc will be undefined for the very first render */}
            {metadata && data ? <Component components={components} metadata={metadata} data={data} /> : null}
          </div>
        )
      }}
    </StoreContext.Consumer>
  )
}

export default MdxWrapper