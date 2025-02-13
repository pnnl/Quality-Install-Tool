import { Button, Tab, Tabs } from 'react-bootstrap'

import CheckboxWrapper from './components/checkbox_wrapper'
import ClimateZoneSelectWrapper from './components/climate_zone_select_wrapper'
import Collapsible from './components/collapsible'
import DateInputWrapper from './components/date_input_wrapper'
import DateStr from './components/date_str'
import FigureWrapper from './components/figure_wrapper'
import FileInputWrapper from './components/file_input_wrapper'
import LabelValueWrapper from './components/label_value_wrapper'
import NumberInputWrapper from './components/number_input_wrapper'
import PDFRendererWrapper from './components/pdf_renderer_wrapper'
import PageBreak from './components/page_break'
import PhotoInputWrapper from './components/photo_input_wrapper'
import PhotoWrapper from './components/photo_wrapper'
import PrintSectionWrapper from './components/print_section wrapper'
import RadioWrapper from './components/radio_wrapper'
import RepeatableInputWrapper from './components/repeatable_input_wrapper'
import RepeatableWrapper from './components/repeatable_wrapper'
import SelectWrapper from './components/select_wrapper'
import ShowOrHideWrapper from './components/show_or_hide_wrapper'
import StringInputWrapper from './components/string_input_wrapper'
import TableWrapper from './components/table_wrapper'
import TextInputWrapper from './components/text_input_wrapper'
import USStateSelectWrapper from './components/us_state_select_wrapper'

export default {
    Button,
    Checkbox: CheckboxWrapper,
    ClimateZoneSelect: ClimateZoneSelectWrapper,
    Collapsible,
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
    Radio: RadioWrapper,
    Repeatable: RepeatableWrapper,
    RepeatableInput: RepeatableInputWrapper,
    Select: SelectWrapper,
    ShowOrHide: ShowOrHideWrapper,
    StringInput: StringInputWrapper,
    Tab,
    Tabs,
    TextInput: TextInputWrapper,
    USStateSelect: USStateSelectWrapper,
    Table: TableWrapper,
}
