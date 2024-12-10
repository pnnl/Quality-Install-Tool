import React, { FC, Suspense } from 'react'
import Button from 'react-bootstrap/Button'
import { StoreContext } from './store'
import ProjectInfoInputs from '../templates/reusable/project_info_inputs.mdx'
import ProjectInfoReport from '../templates/reusable/project_info_report.mdx'

// Lazily initializes the components, rendering them only when requested.
// This reduces the bundle size when the app is loaded, improving initial load time
const Tab = React.lazy(() => import('react-bootstrap/Tab'))
const Tabs = React.lazy(() => import('react-bootstrap/Tabs'))
const Collapsible = React.lazy(() => import('./collapsible'))
const DateInputWrapper = React.lazy(() => import('./date_input_wrapper'))
const DateStr = React.lazy(() => import('./date_str'))
const FigureWrapper = React.lazy(() => import('./figure_wrapper'))
const NumberInputWrapper = React.lazy(() => import('./number_input_wrapper'))
const PhotoWrapper = React.lazy(() => import('./photo_wrapper'))
const PhotoInputWrapper = React.lazy(() => import('./photo_input_wrapper'))
const PrintSectionWrapper = React.lazy(() => import('./print_section wrapper'))
const SelectWrapper = React.lazy(() => import('./select_wrapper'))
const StringInputWrapper = React.lazy(() => import('./string_input_wrapper'))
const TableWrapper = React.lazy(() => import('./table_wrapper'))
const TextInputWrapper = React.lazy(() => import('./text_input_wrapper'))
const USStateSelectWrapper = React.lazy(
    () => import('./us_state_select_wrapper'),
)
const ClimateZoneSelectWrapper = React.lazy(
    () => import('./climate_zone_select_wrapper'),
)
const RadioWrapper = React.lazy(() => import('./radio_wrapper'))
const PageBreak = React.lazy(() => import('./page_break'))
const FileInputWrapper = React.lazy(() => import('./file_input_wrapper'))
const PDFRendererWrapper = React.lazy(() => import('./pdf_renderer_wrapper'))
const ShowOrHide = React.lazy(() => import('./show_or_hide'))
const CheckBoxWrapper = React.lazy(() => import('./checkbox_wrapper'))
const DocNameInputWrapper = React.lazy(() => import('./doc_name_input_wrapper'))
const SaveCancelButtonWrapper = React.lazy(
    () => import('./save_cancel_button_wrapper'),
)
const RepeatableInputWrapper = React.lazy(
    () => import('./repeatable_input_wrapper'),
)
const RepeatableWrapper = React.lazy(() => import('./repeatable_wrapper'))
const CombustionSafetyChecksLink = React.lazy(
    () => import('../templates/reusable/combustion_safety_checks_input.mdx'),
)
const CombustionSafetyChecksReport = React.lazy(
    () => import('../templates/reusable/combustion_safety_checks_report.mdx'),
)
const LabelValueWrapper = React.lazy(() => import('./label_value_wrapper'))

const components = {
    Collapsible,
    ClimateZoneSelect: ClimateZoneSelectWrapper,
    CheckBox: CheckBoxWrapper,
    Button: Button,
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
    ProjectInfoInputs: ProjectInfoInputs,
    ProjectInfoReport: ProjectInfoReport,
    FileInput: FileInputWrapper,
    PDFRenderer: PDFRendererWrapper,
    ShowOrHide: ShowOrHide,
    CombustionSafetyChecksLink: CombustionSafetyChecksLink,
    CombustionSafetyChecksReport: CombustionSafetyChecksReport,
    DocNameInput: DocNameInputWrapper,
    SaveCancelButton: SaveCancelButtonWrapper,
    RepeatableInput: RepeatableInputWrapper,
    Repeatable: RepeatableWrapper,
    LabelValue: LabelValueWrapper,
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
                            <Suspense fallback={<div>Loading...</div>}>
                                <Component
                                    components={components}
                                    metadata={metadata}
                                    data={data}
                                    project={Project}
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
