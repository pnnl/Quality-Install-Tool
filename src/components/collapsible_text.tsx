import React, { useCallback } from 'react'

interface CollapsibleTextProps {
    children?: React.ReactNode
    text: React.ReactNode
    title: React.ReactNode
    isCollapsed: boolean
    onToggle: () => void
}

const CollapsibleText: React.FC<CollapsibleTextProps> = ({
    text,
    isCollapsed,
    onToggle,
}) => {
    const toggleCollapse = useCallback(() => {
        onToggle()
    }, [onToggle])

    const isExpandable = typeof text === 'string' && text.length > 75

    return (
        <div
            className={`collapsible-text ${isCollapsed && isExpandable ? 'collapsed' : ''}`}
        >
            <p className="description">
                {text}
                {isExpandable && (
                    <span
                        className={`clickable-text ${isCollapsed ? 'collapsed' : ''}`}
                        onClick={toggleCollapse}
                    >
                        {isCollapsed ? '...see more' : '...show less'}
                    </span>
                )}
            </p>
        </div>
    )
}

export default CollapsibleText
