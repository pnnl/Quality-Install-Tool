import NumberInput from './number_input'
import LabelValue from './label_value'
import DateInput from './date_input'
import TextInputWrapper from './text_input_wrapper'
import MdxTemplateView from './mdx_template_view'
import { StoreContext, StoreProvider } from './store'
import { useParams } from 'react-router-dom'
import { useDB } from '../utilities/database_utils'

export function Sandbox() {
    //create a
    const { jobId, projectId, workflowName } = useParams()
    const sandboxDb = useDB('sandbox-db')
    return (
        <StoreProvider
            dbName={'sandbox-db'}
            docId={jobId as string}
            workflowName={workflowName as string}
            docName={'test'}
            type={'installation'}
            parentId={projectId as string}
        >
            <StoreContext.Consumer>
                {({ data }) => {
                    // debugger
                    return <div>Test</div>
                }}
            </StoreContext.Consumer>
        </StoreProvider>
    )
}

{
    /* <div className="test-label-section">
<h1>This is a test section </h1>

<p>
    {' '}
    Enter a text value to be retrieved by the LabelValues below
</p>

<TextInputWrapper path="label-value-test-text-input" />

<p>
    {' '}
    Enter a number value to be retrieved by the LabelValues
    below
</p>

<NumberInput path="label-value-test-number-input" />

<h2>LabelValue with no props:</h2>
<code>
    `<LabelValue />`
</code>
<div className="label-value-container" type="string">
    <LabelValue />
</div>

<h2>LabelValue with path prop:</h2>
<code>
    `<LabelValue path="label-value-test-input" />`
</code>
<div className="label-value-container">
    <LabelValue path="label-value-test-input" />
</div>

<h2>LabelValue with number type prop:</h2>
<code>
    `
    <LabelValue
        path="label-value-test-number-input"
        type="number"
    />
    `
</code>
<div className="label-value-container">
    <LabelValue
        path="label-value-test-number-input"
        type="number"
    />
</div>

<h2>LabelValue with number type prop + decimal places:</h2>
<code>
    `
    <LabelValue
        path="label-value-test-number-input"
        type="number"
        decimalPlaces={2}
        prefix="$"
        suffix=" per day"
    />
    `
</code>
<div className="label-value-container">
    <LabelValue
        path="label-value-test-number-input"
        type="number"
        decimalPlaces={2}
        prefix="$"
        suffix=" per day"
    />
</div>

<h2>LabelValue with number type prop + decimal places:</h2>
<code>
    `
    <LabelValue
        path="label-value-test-number-input"
        type="number"
        decimalPlaces={4}
    />
    `
</code>
<div className="label-value-container">
    <LabelValue
        path="label-value-test-number-input"
        type="number"
        decimalPlaces={4}
    />
</div>

 <h2>
LabelValue with number type prop and string value (Will console.log an error
message)
</h2>
<code>`<LabelValue path="label-value-test-text-input" type="number" decimalPlaces={2}/>`</code>
<div className="label-value-container">
<LabelValue
path="label-value-test-text-input"
type="number"
decimalPlaces={2}
/>
</div> 

<DateInput
    label="Pick a date:"
    path="label-value-test-date-input"
/>
<h2>LabelValue with date type</h2>
<code>
    `
    <LabelValue
        path="label-value-test-date-input"
        type="date"
    />
    `
</code>
<div className="label-value-container">
    <LabelValue
        path="label-value-test-date-input"
        type="date"
    />
</div>
</div> */
}
