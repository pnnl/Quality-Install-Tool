import DOEWorkflowHPWHTemplate from './doe_workflow_hpwh.mdx'
import DOEWorkflowAtticAirSealTemplate from './doe_workflow_attic_air_sealing.mdx'
import DOEWorkflowAtticInsulationTemplate from './doe_workflow_attic_insulation.mdx'
import DOEWorkflowDuctlessHeatPumpTemplate from './doe_workflow_ductless_heat_pump.mdx'
import DOEWorkflowCentralDuctedSplitHeatPumpTemplate from './doe_workflow_central_ducted_split_heat_pump.mdx'
import IRADOEWorkflowHPWHTemplate from './ira_doe_workflow_hpwh.mdx'
import IRADOEWorkflowDuctlessHeatPumpTemplate from './ira_doe_workflow_ductless_heat_pump.mdx'
import IRADOEWorkflowCentralDuctedSplitHeatPumpTemplate from './ira_doe_workflow_central_ducted_split_heat_pump.mdx'
import IRADOEWorkflowHighEfficiencyGasFurnace from './ira_doe_workflow_high_efficiency_gas_furnace.mdx'
import IRADOEWorkflowHighEfficiencyTanklessWaterHeater  from './ira_doe_workflow_high_efficiency_tankless_water_heater.mdx'
import IRADOEWorkflowHighEfficiencyModulatingBoiler  from './ira_doe_workflow_high_efficiency_modulating_boiler.mdx'


import { MDXProps } from 'mdx/types'

interface TemplatesConfig {
    [key: string]: {
        title: string
        template: (props: MDXProps) => JSX.Element
    }
}

const templateRegex = /^(?!_)(?!.*_$)[a-z0-9_]{1,64}$/

// Add workflow templates for 'quality-install-tool'
const GENERAL_WORKFLOW_TEMPLATES = {
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
    },
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
    },
    ira_doe_workflow_high_efficiency_gas_furnace: {
        title: 'IRA - High Efficiency Gas Furnace',
        template: IRADOEWorkflowHighEfficiencyGasFurnace,
    },
    ira_doe_workflow_high_efficiency_tankless_water_heater: {
        title: 'IRA - High Efficiency Tankless Water Heater',
        template: IRADOEWorkflowHighEfficiencyTanklessWaterHeater,
    },
    ira_doe_workflow_high_efficiency_modulating_boiler: {
        title: 'IRA - High Efficiency Modulating Boiler',
        template: IRADOEWorkflowHighEfficiencyModulatingBoiler,
    },

}

/**
 * Configure and render workflow templates based on the deployment environment configured in AWS S3 or local development.
 *
 * When deploying the application to AWS S3, the environment variable 'REACT_APP_ENV'
 * is set to 'quality-install-tool' or 'ira-quality-install-tool' for the respective applications.
 *
 * In local development, the 'REACT_APP_ENV' environment variable can be set directly in the 'package.json'
 * under the start script, as shown below:
 *
 * ```
 * "scripts": {
 *   "start": "HTTPS=true REACT_APP_ENV=ira-quality-install-tool node scripts/start.js",
 *   ...
 * }
 * ```
 *
 * The environment variable 'REACT_APP_ENV' is accessed in code using the `process.env` object,
 * which will be populated with the specified value ('quality-install-tool' or 'ira-quality-install-tool')
 * during the build process or local development startup.
 *
 * The `templatesConfig` constant determines which set of workflow templates (`GENERAL_WORKFLOW_TEMPLATES`
 * or `IRA_WORKFLOW_TEMPLATES`) to use based on the value of `process.env.REACT_APP_ENV`.
 *
 * The respective environments ('quality-install-tool' or 'ira-quality-install-tool').
 */

const templatesConfig: TemplatesConfig =
    process.env.REACT_APP_ENV === 'quality-install-tool'
        ? GENERAL_WORKFLOW_TEMPLATES
        : IRA_WORKFLOW_TEMPLATES

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
