import QaHPWHTemplate from './qa_hpwh.mdx'
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
  qa_hpwh: {
    title: "Heat Pump Water Heater",
    template: QaHPWHTemplate,
  },
  old_qa_hpwh: {
    title: "Old – Heat Pump Water Heater",
    template: OldQaHPWHTemplate,
  }
}

export default templatesConfig