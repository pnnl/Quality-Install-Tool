import { MDXProps } from 'mdx/types'
import React from 'react'

import DOECombustionApplianceSafetyTests from './doe_workflow_combustion_appliance_safety_tests.mdx'
import DOEWorkflowAtticAirSealingAndInsulation from './ira_doe_workflow_attic_air_sealing_and_insulation.mdx'
import DOEWorkflowDuctAirSealTemplate from './ira_doe_workflow_duct_air_sealing_and_insulation.mdx'
import DOEWorkflowDuctedHeatPumpTemplate from './doe_workflow_heat_pump_ducted.mdx'
import DOEWorkflowDuctlessHeatPumpTemplate from './doe_workflow_heat_pump_ductless.mdx'
import DOEWorkflowElectricCookTemplate from './ira_doe_workflow_electric_cooking_appliance.mdx'
import DOEWorkflowElectricLoadServiceTemplate from './ira_doe_workflow_electric_load_service_center.mdx'
import DOEWorkflowElectricWiringTemplate from './ira_doe_workflow_electric_wiring.mdx'
import DOEWorkflowFloorAirSealingAndInsulation from './ira_doe_workflow_floor_air_sealing_and_insulation.mdx'
import DOEWorkflowFoundationAirSealingAndInsulation from './ira_doe_workflow_foundation_wall_air_sealing_and_insulation.mdx'
import DOEWorkflowFullFrameReplacementWindows from './ira_doe_workflow_full_frame_replacement_windows.mdx'
import DOEWorkflowHPClothDyer from './ira_doe_workflow_heat_pump_cloth_dryer.mdx'
import DOEWorkflowHeatPumpWaterHeaterTemplate from './doe_workflow_heat_pump_water_heater.mdx'
import DOEWorkflowHighEfficiencyGasFurnace from './ira_doe_workflow_high_efficiency_gas_furnace.mdx'
import DOEWorkflowHighEfficiencyModulatingBoiler from './ira_doe_workflow_high_efficiency_modulating_boiler.mdx'
import DOEWorkflowHighEfficiencyWaterHeater from './ira_doe_workflow_high_efficiency_water_heater.mdx'
import DOEWorkflowInsertReplacementWindows from './ira_doe_workflow_insert_replacement_windows.mdx'
import DOEWorkflowMechanicalVentilation from './ira_doe_workflow_mechanical_ventilation.mdx'
import DOEWorkflowSlapFoundationExterior from './ira_doe_workflow_slap_foundation_exterior_sealing_and_insulation.mdx'
import DOEWorkflowWallAirSealingAndInsulation from './ira_doe_workflow_wall_air_sealing_and_insulation_dry_fill.mdx'
import IRADOEWorkflowLimitedAssessment from './ira_doe_workflow_limited_assessment.mdx'
// import Playground from './playground.mdx'

import {
    type BaseData,
    type BaseMetadata,
    type Project,
} from '../types/database.types'

export interface TemplateProps {
    project?: PouchDB.Core.Document<Project> & PouchDB.Core.GetMeta
    data: BaseData
    metadata: BaseMetadata
}

export interface TemplateConfiguration {
    title: string
    template: React.FC<MDXProps & TemplateProps>
}

const TEMPLATES: Record<string, TemplateConfiguration> = {
    doe_workflow_attic_air_sealing_and_insulation: {
        title: 'Attic Air Sealing and Insulation',
        template: DOEWorkflowAtticAirSealingAndInsulation,
    },
    doe_combustion_appliance_safety_tests: {
        title: 'Combustion Appliance Safety Testing',
        template: DOECombustionApplianceSafetyTests,
    },
    doe_workflow_duct_air_sealing: {
        title: 'Duct Air Sealing and Insulation',
        template: DOEWorkflowDuctAirSealTemplate,
    },
    doe_workflow_electric_cooking_appliances: {
        title: 'Electric Cooking Appliances',
        template: DOEWorkflowElectricCookTemplate,
    },
    doe_workflow_electric_wiring: {
        title: 'Electric Wiring',
        template: DOEWorkflowElectricWiringTemplate,
    },
    doe_workflow_electric_load_service_center: {
        title: 'Electric Load Service Center',
        template: DOEWorkflowElectricLoadServiceTemplate,
    },
    doe_workflow_floor_airsealing_and_insulation: {
        title: 'Floor Air Sealing and Insulation Above Unconditioned Space',
        template: DOEWorkflowFloorAirSealingAndInsulation,
    },
    doe_workflow_foundation_airsealing_and_insulation: {
        title: 'Foundation Wall Air Sealing and Insulation',
        template: DOEWorkflowFoundationAirSealingAndInsulation,
    },
    doe_workflow_full_frame_replacement_windows: {
        title: 'Full Frame Replacement Windows',
        template: DOEWorkflowFullFrameReplacementWindows,
    },
    doe_workflow_heat_pump_cloth_dryer: {
        title: 'Heat Pump Clothes Dryer ',
        template: DOEWorkflowHPClothDyer,
    },
    doe_workflow_central_ducted_split_heat_pump: {
        title: 'Heat Pump Ducted',
        template: DOEWorkflowDuctedHeatPumpTemplate,
    },
    doe_workflow_ductless_heat_pump: {
        title: 'Heat Pump Ductless',
        template: DOEWorkflowDuctlessHeatPumpTemplate,
    },
    doe_workflow_heat_pump_water_heater: {
        title: 'Heat Pump Water Heater',
        template: DOEWorkflowHeatPumpWaterHeaterTemplate,
    },
    doe_workflow_high_efficiency_gas_furnace: {
        title: 'High Efficiency Gas Furnace',
        template: DOEWorkflowHighEfficiencyGasFurnace,
    },
    doe_workflow_high_efficiency_modulating_boiler: {
        title: 'High Efficiency Modulating Boiler',
        template: DOEWorkflowHighEfficiencyModulatingBoiler,
    },
    doe_workflow_high_efficiency_water_heater: {
        title: 'High Efficiency Water Heater',
        template: DOEWorkflowHighEfficiencyWaterHeater,
    },
    doe_workflow_insert_replacement_windows: {
        title: 'Insert Replacement Windows',
        template: DOEWorkflowInsertReplacementWindows,
    },
    doe_workflow_mechanical_ventilation: {
        title: 'Mechanical Ventilation',
        template: DOEWorkflowMechanicalVentilation,
    },
    doe_workflow_slab_foundation_exterior: {
        title: 'Slab Foundation Exterior Perimeter Sealing and Insulation',
        template: DOEWorkflowSlapFoundationExterior,
    },
    doe_workflow_wall_air_sealing_and_insulation_exterior: {
        title: 'Wall Air Sealing and Insulation (Drill and Fill)',
        template: DOEWorkflowWallAirSealingAndInsulation,
    },
    ira_doe_workflow_limited_assessment: {
        title: 'IRA Limited Assessment',
        template: IRADOEWorkflowLimitedAssessment,
    },
    // playground: {
    //     title: 'Playground',
    //     template: Playground,
    // },
}

const RESERVED_TEMPLATE_KEYS: string[] = ['workflows']

const RE_TEMPLATE_KEY: RegExp = /^(?!_)(?!.*_$)[a-z0-9_]{1,64}$/i

Object.keys(TEMPLATES).forEach(key => {
    if (RESERVED_TEMPLATE_KEYS.includes(key) || !RE_TEMPLATE_KEY.test(key)) {
        throw new Error(`Invalid template key: ${JSON.stringify(key)}`)
    }
})

export default TEMPLATES
