import { detectOverflow } from '@popperjs/core'
import { over } from 'lodash'
import React, { useState } from 'react'
import { Card, Button } from 'react-bootstrap'

interface CollapsibleTextProps {
    text: string
    title: string
}

const CollapsibleText = (props: CollapsibleTextProps) => {
    const { text, title } = props
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <Card>
            {/* <Card.Body> */}
            <div>
                <Card.Title>{title}</Card.Title>
                <Card.Body
                    style={{
                        height: '69px',
                        // backgroundColor: 'pink',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <p className="truncate-two-lines">
                        {text}
                        <span
                            style={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                padding: '0 0px 0px 5px',
                                bottom: '5px',
                                right: '10px',
                            }}
                            className="clickable-text"
                            onClick={toggleCollapse}
                        >
                            {isCollapsed ? '...see more' : 'See less'}
                        </span>
                    </p>
                </Card.Body>
            </div>
            {/* </Card.Body> */}
        </Card>
    )
}

export default CollapsibleText
