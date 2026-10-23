import React, { useCallback, useEffect, useRef, useState } from 'react'

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
    const textContainerRef = useRef<HTMLDivElement>(null)
    const [isExpandable, setIsExpandable] = useState(false)

    const toggleCollapse = useCallback(() => {
        onToggle()
    }, [onToggle])

    useEffect(() => {
        const updateExpandableState = () => {
            const textContainer = textContainerRef.current

            if (!textContainer) {
                return
            }

            const wasCollapsed = textContainer.classList.contains('collapsed')

            // Measure overflow against the collapsed height limit.
            if (!wasCollapsed) {
                textContainer.classList.add('collapsed')
            }

            const hasOverflow =
                textContainer.scrollHeight > textContainer.clientHeight + 1

            if (!wasCollapsed) {
                textContainer.classList.remove('collapsed')
            }

            setIsExpandable(hasOverflow)
        }

        updateExpandableState()
        window.addEventListener('resize', updateExpandableState)

        // Content inside an inactive tab is display:none and measures 0, so
        // re-measure once the element becomes visible.
        const observer =
            typeof ResizeObserver !== 'undefined' && textContainerRef.current
                ? new ResizeObserver(updateExpandableState)
                : null
        if (observer && textContainerRef.current) {
            observer.observe(textContainerRef.current)
        }

        return () => {
            window.removeEventListener('resize', updateExpandableState)
            observer?.disconnect()
        }
    }, [text])

    return (
        <div
            ref={textContainerRef}
            className={`collapsible-text ${isCollapsed && isExpandable ? 'collapsed' : ''}`}
        >
            <div className="description">
                {text}
                {isExpandable && (
                    <span
                        className={`clickable-text ${isCollapsed ? 'collapsed' : ''}`}
                        onClick={toggleCollapse}
                    >
                        {isCollapsed ? '...see more' : '...show less'}
                    </span>
                )}
            </div>
        </div>
    )
}

export default CollapsibleText
