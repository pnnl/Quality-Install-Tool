import PouchDB from 'pouchdb'
import React, { Suspense } from 'react'
import { Button, Tab, Tabs } from 'react-bootstrap'

import { StoreContext } from './store'
import ProjectInfoInputs from '../templates/reusable/project_info_inputs.mdx'
import ProjectInfoReport from '../templates/reusable/project_info_report.mdx'
import { type Project } from '../types/database.types'

const CheckBoxWrapper = React.lazy(() => import('./checkbox_wrapper'))
const ClimateZoneSelectWrapper = React.lazy(
    () => import('./climate_zone_select_wrapper'),
)
const Collapsible = React.lazy(() => import('./collapsible'))
const CombustionSafetyChecksLink = React.lazy(
    () => import('../templates/reusable/combustion_safety_checks_input.mdx'),
)
const CombustionSafetyChecksReport = React.lazy(
    () => import('../templates/reusable/combustion_safety_checks_report.mdx'),
)
const DateInputWrapper = React.lazy(() => import('./date_input_wrapper'))
const DateStr = React.lazy(() => import('./date_str'))
const FigureWrapper = React.lazy(() => import('./figure_wrapper'))
const FileInputWrapper = React.lazy(() => import('./file_input_wrapper'))
const LabelValueWrapper = React.lazy(() => import('./label_value_wrapper'))
const NumberInputWrapper = React.lazy(() => import('./number_input_wrapper'))
const PDFRendererWrapper = React.lazy(() => import('./pdf_renderer_wrapper'))
const PageBreak = React.lazy(() => import('./page_break'))
const PhotoInputWrapper = React.lazy(() => import('./photo_input_wrapper'))
const PhotoWrapper = React.lazy(() => import('./photo_wrapper'))
const PrintSectionWrapper = React.lazy(() => import('./print_section wrapper'))
const RadioWrapper = React.lazy(() => import('./radio_wrapper'))
const RepeatableInputWrapper = React.lazy(
    () => import('./repeatable_input_wrapper'),
)
const RepeatableWrapper = React.lazy(() => import('./repeatable_wrapper'))
const SelectWrapper = React.lazy(() => import('./select_wrapper'))
const ShowOrHide = React.lazy(() => import('./show_or_hide'))
const StringInputWrapper = React.lazy(() => import('./string_input_wrapper'))
const TableWrapper = React.lazy(() => import('./table_wrapper'))
const TextInputWrapper = React.lazy(() => import('./text_input_wrapper'))
const USStateSelectWrapper = React.lazy(
    () => import('./us_state_select_wrapper'),
)

const COMPONENTS = {
    Button,
    CheckBox: CheckBoxWrapper,
    ClimateZoneSelect: ClimateZoneSelectWrapper,
    Collapsible,
    CombustionSafetyChecksLink: CombustionSafetyChecksLink,
    CombustionSafetyChecksReport: CombustionSafetyChecksReport,
    DateInput: DateInputWrapper,
    DateStr: DateStr,
    Figure: FigureWrapper,
    FileInput: FileInputWrapper,
    LabelValue: LabelValueWrapper,
    NumberInput: NumberInputWrapper,
    PDFRenderer: PDFRendererWrapper,
    PageBreak: PageBreak,
    Photo: PhotoWrapper,
    PhotoInput: PhotoInputWrapper,
    PrintSection: PrintSectionWrapper,
    ProjectInfoInputs: ProjectInfoInputs,
    ProjectInfoReport: ProjectInfoReport,
    Radio: RadioWrapper,
    Repeatable: RepeatableWrapper,
    RepeatableInput: RepeatableInputWrapper,
    Select: SelectWrapper,
    ShowOrHide: ShowOrHide,
    StringInput: StringInputWrapper,
    Tab,
    Tabs,
    TextInput: TextInputWrapper,
    USStateSelect: USStateSelectWrapper,
    table: TableWrapper,
}

interface MdxWrapperProps {
    Component: React.ComponentType<any>
    project?: PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta
}

const MdxWrapper: React.FC<MdxWrapperProps> = ({ Component, project }) => {
    return (
        <StoreContext.Consumer>
            {({ metadata, data }) => {
                return (
                    <div className="container" id="mdx-container">
                        {/* metadata and data will be undefined for the very first render */}
                        {metadata && data ? (
                            <Suspense fallback={<div>Loading...</div>}>
                                <Component
                                    components={COMPONENTS}
                                    metadata={metadata}
                                    data={data}
                                    project={project}
                                />
                            </Suspense>
                        ) : null}
                    </div>
                )
            }}
        </StoreContext.Consumer>
    )
}

export default MdxWrapper
