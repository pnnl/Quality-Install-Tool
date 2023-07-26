import QaHPWHTemplate from './qa_hpwh.mdx'
import DOEWorkflowHPWHTemplate from './doe_workflow_hpwh.mdx'
import DOEWorkflowAtticAirSealTemplate from './doe_workflow_atticairsealing.mdx'
import DOEWorkflowAtticInsulationTemplate from './doe_workflow_atticinsulation.mdx'

import OldQaHPWHTemplate from './old-qa_hpwh.mdx'
import MdxPlayground from './playground.mdx'
import { MDXProps } from 'mdx/types';

interface TemplateConfig {
  [key: string]: {
    title: string;
    template: (props: MDXProps) => JSX.Element;
  };
}

const templatesConfig : TemplateConfig = {
  doe_workflow_hpwh: {
    title: "Heat Pump Water Heater",
    template: DOEWorkflowHPWHTemplate,
  },
  doe_workflow_attic_sealing: {
    title: "Attic Air Sealing",
    template: DOEWorkflowAtticAirSealTemplate,
  },
  doe_workflow_attic_insulation: {
    title: "Attic Insulation",
    template: DOEWorkflowAtticInsulationTemplate,
  }
}

export default templatesConfig