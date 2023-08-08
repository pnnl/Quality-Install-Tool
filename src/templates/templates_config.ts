import QaHPWHTemplate from './qa_hpwh.mdx'
import DOEWorkflowHPWHTemplate from './doe_workflow_hpwh.mdx'
import DOEWorkflowAtticAirSealTemplate from './doe_workflow_attic_air_sealing.mdx'
import DOEWorkflowAtticInsulationTemplate from './doe_workflow_attic_insulation.mdx'

import OldQaHPWHTemplate from './old-qa_hpwh.mdx'
import MdxPlayground from './playground.mdx'
import { MDXProps } from 'mdx/types'

interface TemplatesConfig {
  [key: string]: {
    title: string;
    template: (props: MDXProps) => JSX.Element;
  };
}

const templateRegex = /^(?!_)(?!.*_$)[a-z0-9_]{1,64}$/

const templatesConfig: TemplatesConfig = {
    doe_workflow_hpwh: {
        title: 'Heat Pump Water Heater',
        template: DOEWorkflowHPWHTemplate,
    },
    doe_workflow_attic_air_sealing: {
        title: 'Attic Air Sealing',
        template: DOEWorkflowAtticAirSealTemplate,
    },
    doe_workflow_attic_insulation: {
        title: 'Attic Insulation',
        template: DOEWorkflowAtticInsulationTemplate,
    },
}
/**
 * Validates a TemplatesConfig object by checking if template names adhere to templateRegex pattern.
 * @param {TemplatesConfig} config - The TemplatesConfig object to validate.
 * @throws {Error} Throws an error if one or more template names are not allowed.
 */
function validateTemplatesConfig(config: TemplatesConfig) {
  Object.keys(config).forEach((key) =>
    {
      if(!templateRegex.test(key)){
        throw new Error(key + " template name is not allowed") //Decide on what to do if not pass
      }
    }
  );
};

validateTemplatesConfig(templatesConfig)

export default templatesConfig
