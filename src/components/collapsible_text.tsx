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

        // Measuring toggles a class on the observed element, so defer it to the
        // next frame; doing it inside the ResizeObserver callback triggers
        // "ResizeObserver loop completed with undelivered notifications".
        let frame = 0
        const scheduleUpdate = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(updateExpandableState)
        }

        updateExpandableState()

        // Content inside an inactive tab is display:none and measures 0, so
        // re-measure once the element becomes visible.
        const resizeObserver =
            typeof ResizeObserver === 'undefined'
                ? undefined
                : new ResizeObserver(scheduleUpdate)
        const textContainer = textContainerRef.current

        if (resizeObserver && textContainer) {
            resizeObserver.observe(textContainer)
        }
        window.addEventListener('resize', scheduleUpdate)

        return () => {
            cancelAnimationFrame(frame)
            resizeObserver?.disconnect()
            window.removeEventListener('resize', scheduleUpdate)
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
