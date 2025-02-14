import { MDXProvider } from '@mdx-js/react'
import { MDXProps } from 'mdx/types'
import PouchDB from 'pouchdb'
import React, { Suspense } from 'react'
import { Button, Tab, Tabs } from 'react-bootstrap'

import CheckboxWrapper from './checkbox_wrapper'
import ClimateZoneSelectWrapper from './climate_zone_select_wrapper'
import Collapsible from './collapsible'
import DateInputWrapper from './date_input_wrapper'
import DateStr from './date_str'
import DateTimeStr from './date_time_str'
import FigureWrapper from './figure_wrapper'
import FileInputWrapper from './file_input_wrapper'
import GpsCoordStr from './gps_coord_str'
import LabelValueWrapper from './label_value_wrapper'
import LocationStr from './location_str'
import NumberInputWrapper from './number_input_wrapper'
import PDFRendererWrapper from './pdf_renderer_wrapper'
import PageBreak from './page_break'
import PhotoInputWrapper from './photo_input_wrapper'
import PhotoWrapper from './photo_wrapper'
import PrintSectionWrapper from './print_section wrapper'
import RadioWrapper from './radio_wrapper'
import RepeatableInputWrapper from './repeatable_input_wrapper'
import RepeatableWrapper from './repeatable_wrapper'
import SelectWrapper from './select_wrapper'
import ShowOrHideWrapper from './show_or_hide_wrapper'
import StringInputWrapper from './string_input_wrapper'
import TableWrapper from './table_wrapper'
import TextInputWrapper from './text_input_wrapper'
import USStateSelectWrapper from './us_state_select_wrapper'
import { StoreContext } from '../providers/store_provider'
import { type TemplateProps } from '../templates'
import { type Project } from '../types/database.types'

const components = {
    Button,
    Checkbox: CheckboxWrapper,
    ClimateZoneSelect: ClimateZoneSelectWrapper,
    Collapsible,
    DateInput: DateInputWrapper,
    DateStr,
    DateTimeStr,
    Figure: FigureWrapper,
    FileInput: FileInputWrapper,
    GpsCoordStr,
    LabelValue: LabelValueWrapper,
    LocationStr,
    NumberInput: NumberInputWrapper,
    PDFRenderer: PDFRendererWrapper,
    PageBreak,
    Photo: PhotoWrapper,
    PhotoInput: PhotoInputWrapper,
    PrintSection: PrintSectionWrapper,
    Radio: RadioWrapper,
    Repeatable: RepeatableWrapper,
    RepeatableInput: RepeatableInputWrapper,
    Select: SelectWrapper,
    ShowOrHide: ShowOrHideWrapper,
    StringInput: StringInputWrapper,
    Tab,
    Table: TableWrapper,
    Tabs,
    TextInput: TextInputWrapper,
    USStateSelect: USStateSelectWrapper,
}

interface MdxWrapperProps {
    Component: React.FC<MDXProps & TemplateProps>
    project?: PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta
}

const MdxWrapper: React.FC<MdxWrapperProps> = ({ Component, project }) => {
    return (
        <StoreContext.Consumer>
            {({ doc }) => {
                return (
                    <div className="container" id="mdx-container">
                        {doc && (
                            <Suspense fallback={<div>Loading...</div>}>
                                <MDXProvider components={components}>
                                    <Component
                                        project={project}
                                        data={doc.data_}
                                        metadata={doc.metadata_}
                                    />
                                </MDXProvider>
                            </Suspense>
                        )}
                    </div>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default MdxWrapper
