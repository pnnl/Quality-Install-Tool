import React, { createContext, useContext } from 'react'

import templatesConfig, {
    type TemplateConfiguration,
} from '../templates/templates_config'

export const WorkflowContext = createContext<TemplateConfiguration | undefined>(
    undefined,
)

export function useWorkflow(): TemplateConfiguration | undefined {
    return useContext(WorkflowContext)
}

interface WorkflowProviderProps {
    workflowName: keyof typeof templatesConfig | undefined
    children: React.ReactNode
}

const WorkflowProvider: React.FC<WorkflowProviderProps> = ({
    workflowName,
    children,
}) => {
    if (workflowName && workflowName in templatesConfig) {
        return (
            <WorkflowContext.Provider value={templatesConfig[workflowName]}>
                {children}
            </WorkflowContext.Provider>
        )
    } else {
        return <p>Workflow not found.</p>
    }
}

export default WorkflowProvider
