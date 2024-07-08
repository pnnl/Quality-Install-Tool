import IRADOEWorkflowHPWHTemplate from './ira_doe_workflow_hpwh.mdx'
import IRADOEWorkflowDuctlessHeatPumpTemplate from './ira_doe_workflow_ductless_heat_pump.mdx'
import IRADOEWorkflowCentralDuctedSplitHeatPumpTemplate from './ira_doe_workflow_central_ducted_split_heat_pump.mdx'
import { MDXProps } from 'mdx/types'

interface TemplatesConfig {
    [key: string]: {
        title: string
        template: (props: MDXProps) => JSX.Element
    }
}

const templateRegex = /^(?!_)(?!.*_$)[a-z0-9_]{1,64}$/

const templatesConfig: TemplatesConfig = {
    ira_doe_workflow_central_ducted_split_heat_pump: {
        title: 'IRA - Heat Pump Ducted',
        template: IRADOEWorkflowCentralDuctedSplitHeatPumpTemplate,
    },
    ira_doe_workflow_ductless_heat_pump: {
        title: 'IRA - Heat Pump Ductless',
        template: IRADOEWorkflowDuctlessHeatPumpTemplate,
    },
    ira_doe_workflow_hpwh: {
        title: 'IRA - Heat Pump Water Heater',
        template: IRADOEWorkflowHPWHTemplate,
    },
}

// Assuming TemplatesConfig is defined somewhere as a type or interface

/**
 * Validates a TemplatesConfig object by checking if template names adhere to templateRegex pattern.
 * @param {TemplatesConfig} config - The TemplatesConfig object to validate.
 * @throws {Error} Throws an error if one or more template names are not allowed.
 */
function validateTemplatesConfig(config: TemplatesConfig) {
    Object.keys(config).forEach(key => {
        if (!templateRegex.test(key)) {
            throw new Error(key + ' template name is not allowed') //Decide on what to do if not pass
        }
    })
}

validateTemplatesConfig(templatesConfig)

export default templatesConfig
