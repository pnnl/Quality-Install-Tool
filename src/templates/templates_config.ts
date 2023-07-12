import QaHPWHTemplate from './qa_hpwh.mdx'
import DOEWorkflowHPWHTemplate from './doe_workflow_hpwh.mdx'
import OldQaHPWHTemplate from './old-qa_hpwh.mdx'
import MdxPlayground from './playground.mdx'
import { MDXProps } from 'mdx/types';

interface TemplateConfig {
  [key: string]: {
    title: string;
    template: (props: MDXProps) => JSX.Element;
  };
}

const templateRegex = /^[a-zA-Z0-9!@#$%^&*()-+=_{}|:;"'<>,.?~`]{1,64}$/ //TODO: decide on the Regex

const templatesConfig : TemplateConfig = {
  doe_workflow_hpwh: {
    title: "Heat Pump Water Heater",
    template: DOEWorkflowHPWHTemplate,
  }
  // Add other template configurations here...
}

const validateTemplatesConfig = (config: TemplateConfig) => {
  const isValidKeys = Object.keys(config).every((key) =>
    {
      if(!templateRegex.test(key)){
        throw new Error(key + "template name is not allowed") //Decide on what to do if not pass
      }
      return templateRegex.test(key)
    }
  );

  if (isValidKeys) {
    return config;
  } else {
    throw new Error("one or more template names are not allowed") //Decide on what to do if not pass
  }
};

export default validateTemplatesConfig(templatesConfig);