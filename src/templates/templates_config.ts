import DOEWorkflowHPWHTemplate from './doe_workflow_hpwh.mdx'
import DOEWorkflowAtticAirSealTemplate from './doe_workflow_attic_air_sealing.mdx'
import DOEWorkflowAtticInsulationTemplate from './doe_workflow_attic_insulation.mdx'
import DOEWorkflowDuctlessHeatPumpTemplate from './doe_workflow_ductless_heat_pump.mdx'
import DOEWorkflowCentralDuctedSplitHeatPumpTemplate from './doe_workflow_central_ducted_split_heat_pump.mdx'
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

// Add workflow templates for 'ira-quality-install-tool' 
const GENERAL_WORKFLOW_TEMPLATES =  {
    doe_workflow_attic_air_sealing: {
        title: 'Attic Air Sealing',
        template: DOEWorkflowAtticAirSealTemplate,
    },
    doe_workflow_attic_insulation: {
        title: 'Attic Insulation',
        template: DOEWorkflowAtticInsulationTemplate,
    },
    doe_workflow_central_ducted_split_heat_pump: {
        title: 'Heat Pump Ducted',
        template: DOEWorkflowCentralDuctedSplitHeatPumpTemplate,
    },
    doe_workflow_ductless_heat_pump: {
        title: 'Heat Pump Ductless',
        template: DOEWorkflowDuctlessHeatPumpTemplate,
    },
    doe_workflow_hpwh: {
        title: 'Heat Pump Water Heater',
        template: DOEWorkflowHPWHTemplate,
    }
}


// Add workflow templates for 'ira-quality-install-tool' 
const IRA_WORKFLOW_TEMPLATES = {
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
    }
}

// Configure the templatesConfig based on the deployed environment's specifications.
const templatesConfig: TemplatesConfig = process.env.REACT_APP_ENV === 'quality-install-tool' ? GENERAL_WORKFLOW_TEMPLATES: IRA_WORKFLOW_TEMPLATES
    
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
