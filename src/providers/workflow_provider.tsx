import React, { createContext, useContext } from 'react'

import templates, { type TemplateConfiguration } from '../templates'

export const WorkflowContext = createContext<TemplateConfiguration | undefined>(
    undefined,
)

export function useWorkflow(): TemplateConfiguration | undefined {
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
        return (
            <WorkflowContext.Provider value={templates[workflowName]}>
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
