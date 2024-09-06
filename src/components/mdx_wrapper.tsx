import React from 'react'
import type { FC } from 'react'

import Collapsible from './collapsible'
import DateInputWrapper from './date_input_wrapper'
import FigureWrapper from './figure_wrapper'
import NumberInputWrapper from './number_input_wrapper'
import PhotoWrapper from './photo_wrapper'
import PhotoInputWrapper from './photo_input_wrapper'
import PrintSection from './print_section'
import SelectWrapper from './select_wrapper'
import StringInputWrapper from './string_input_wrapper'
import TableWrapper from './table_wrapper'
import TextInputWrapper from './text_input_wrapper'
import USStateSelectWrapper from './us_state_select_wrapper'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { StoreContext } from './store'
import DateStr from './date_str'
import ClimateZoneSelectWrapper from './climate_zone_select_wrapper'
import RadioWrapper from './radio_wrapper'
import PageBreak from './page_break'
import ProjectInfoInputs from '../templates/reusable/project_info_inputs.mdx'
import ProjectInfoReport from '../templates/reusable/project_info_report.mdx'
import PrintSectionWrapper from './print_section wrapper'
import FileInputWrapper from './file_input_wrapper'
import PDFRendererWrapper from './pdf_renderer_wrapper'
import ShowOrHide from './show_or_hide'
import Select from './select_wrapper'
import DocNameInputWrapper from './doc_name_input_wrapper'
import DocNameInput from './doc_name_input'
import SaveCancelButtonWrapper from './save_cancel_button_wrapper'

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
    SelectWrapper: Select,
    Tab: Tab,
    Tabs: Tabs,
    PageBreak: PageBreak,
    ProjectInfoInputs: ProjectInfoInputs,
    ProjectInfoReport: ProjectInfoReport,
    FileInput: FileInputWrapper,
    PDFRenderer: PDFRendererWrapper,
    ShowOrHide: ShowOrHide,
    DocNameInput: DocNameInputWrapper,
    SaveCancelButton: SaveCancelButtonWrapper,
}

interface MdxWrapperProps {
    Component: React.ComponentType<any>
    Project: any
}

/**
 * A component that wraps an MDX component instance in order to tie it to the data store
 * and place it inside a bootstrap container
 *
 * @param Component An MDX component instance
 */
const MdxWrapper: FC<MdxWrapperProps> = ({ Component, Project }) => {
    return (
        <StoreContext.Consumer>
            {({ metadata, data }) => {
                return (
                    <div className="container" id="mdx-container">
                        {/* metadata and data will be undefined for the very first render */}
                        {metadata && data ? (
                            <Component
                                components={components}
                                metadata={metadata}
                                data={data}
                                project={Project}
                            />
                        ) : null}
                    </div>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default MdxWrapper
