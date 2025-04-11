import React, { createContext, useContext } from 'react'

import templates, { type TemplateConfiguration } from '../templates'

/**
 * Returns a formatted subtitle text based on the context where it is displayed.
 * @param subTitle - The subtitle to format.
 * @param context - The context where the subtitle is displayed (e.g., 'header', 'inline_text').
 * @returns The formatted subtitle text.
 */
export function getFormattedSubTitle(
    subTitle: string,
    context: string,
): string {
    switch (context) {
        case 'header':
            return subTitle.toUpperCase()
        case 'inline_text':
            return `${subTitle.toLowerCase()}`
        default:
            return subTitle
    }
}

export const WorkflowContext = createContext<
    | (TemplateConfiguration & {
          getFormattedSubTitle: (context: string) => string
      })
    | undefined
>(undefined)

export function useWorkflow():
    | (TemplateConfiguration & {
          getFormattedSubTitle: (context: string) => string
      })
    | undefined {
    return useContext(WorkflowContext)
}

interface WorkflowProviderProps {
    workflowName: string | undefined
    children: React.ReactNode
}

const WorkflowProvider: React.FC<WorkflowProviderProps> = ({
    workflowName,
    children,
}) => {
    if (workflowName && workflowName in templates) {
        const workflow = templates[workflowName]

        //Extending with the getFormattedSubTitle method
        const workflowWithFormatter = {
            ...workflow,
            getFormattedSubTitle: (context: string) =>
                getFormattedSubTitle(workflow.sub_title, context),
        }

        return (
            <WorkflowContext.Provider value={workflowWithFormatter}>
                {children}
            </WorkflowContext.Provider>
        )
    } else {
        return (
            <div className="container">
                <p>Workflow not found.</p>
            </div>
        )
    }
}

export default WorkflowProvider
