import DOEWorkflowHPWHTemplate from './doe_workflow_hpwh.mdx'
import DOEWorkflowAtticAirSealTemplate from './doe_workflow_attic_air_sealing.mdx'
import DOEWorkflowAtticInsulationTemplate from './doe_workflow_attic_insulation.mdx'
import DOEWorkflowDuctlessHeatPumpTemplate from './doe_workflow_ductless_heat_pump.mdx'
import DOEWorkflowCentralDuctedSplitHeatPumpTemplate from './doe_workflow_central_ducted_split_heat_pump.mdx'
import IRADOEWorkflowHPWHTemplate from './ira_doe_workflow_hpwh.mdx'
import IRADOEWorkflowDuctlessHeatPumpTemplate from './ira_doe_workflow_ductless_heat_pump.mdx'
import IRADOEWorkflowCentralDuctedSplitHeatPumpTemplate from './ira_doe_workflow_central_ducted_split_heat_pump.mdx'
import IRADOEWorkflowHighEfficiencyGasFurnace from './ira_doe_workflow_high_efficiency_gas_furnace.mdx'
import IRADOEWorkflowHighEfficiencyWaterHeater from './ira_doe_workflow_high_efficiency_water_heater.mdx'
import IRADOEWorkflowHighEfficiencyModulatingBoiler from './ira_doe_workflow_high_efficiency_modulating_boiler.mdx'
import IRADOEWorkflowFullFrameReplacementWindows from './ira_doe_workflow_full_frame_replacement_windows.mdx'
import IRADOEWorkflowInsertReplacementWindows from './ira_doe_workflow_insert_replacement_windows.mdx'
import IRADOEWorkflowLimitedAssessment from './ira_doe_workflow_limited_assessment.mdx'

import { MDXProps } from 'mdx/types'

interface TemplatesConfig {
    [key: string]: {
        title: string
        template: (props: MDXProps) => JSX.Element
    }
}

const templateRegex = /^(?!_)(?!.*_$)[a-z0-9_]{1,64}$/

// Add workflow templates for 'quality-install-tool'
const templatesConfig: TemplatesConfig = {
    doe_workflow_attic_air_sealing: {
        title: 'Attic Air Sealing',
        template: DOEWorkflowAtticAirSealTemplate,
    },
    doe_workflow_attic_insulation: {
        title: 'Attic Insulation',
        template: DOEWorkflowAtticInsulationTemplate,
    },
    ira_doe_workflow_full_frame_replacement_windows: {
        title: 'Full Frame Replacement Windows',
        template: IRADOEWorkflowFullFrameReplacementWindows,
    },
    ira_doe_workflow_central_ducted_split_heat_pump: {
        title: 'Heat Pump Ducted',
        template: IRADOEWorkflowCentralDuctedSplitHeatPumpTemplate,
    },
    ira_doe_workflow_ductless_heat_pump: {
        title: 'Heat Pump Ductless',
        template: IRADOEWorkflowDuctlessHeatPumpTemplate,
    },
    ira_doe_workflow_hpwh: {
        title: 'Heat Pump Water Heater',
        template: IRADOEWorkflowHPWHTemplate,
    },
    ira_doe_workflow_high_efficiency_gas_furnace: {
        title: 'High Efficiency Gas Furnace',
        template: IRADOEWorkflowHighEfficiencyGasFurnace,
    },
    ira_doe_workflow_high_efficiency_water_heater: {
        title: 'High Efficiency Water Heater',
        template: IRADOEWorkflowHighEfficiencyWaterHeater,
    },
    ira_doe_workflow_high_efficiency_modulating_boiler: {
        title: 'High Efficiency Modulating Boiler',
        template: IRADOEWorkflowHighEfficiencyModulatingBoiler,
    },
    ira_doe_workflow_insert_replacement_windows: {
        title: 'Insert Replacement Windows',
        template: IRADOEWorkflowInsertReplacementWindows,
    },
    ira_doe_workflow_limited_assessment: {
        title: 'Limited Assessent',
        template: IRADOEWorkflowLimitedAssessment,
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
