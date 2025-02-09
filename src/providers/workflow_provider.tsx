import React, { createContext, useContext } from 'react'

import TEMPLATES, { type TemplateConfiguration } from '../templates'

export const WorkflowContext = createContext<TemplateConfiguration | undefined>(
    undefined,
)

export function useWorkflow(): TemplateConfiguration | undefined {
    return useContext(WorkflowContext)
}

interface WorkflowProviderProps {
    workflowName: keyof typeof TEMPLATES | undefined
    children: React.ReactNode
}

const WorkflowProvider: React.FC<WorkflowProviderProps> = ({
    workflowName,
    children,
}) => {
    if (workflowName && workflowName in TEMPLATES) {
        return (
            <WorkflowContext.Provider value={TEMPLATES[workflowName]}>
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
