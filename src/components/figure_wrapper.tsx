import React from 'react'
import { Figure, FigureCaption, FigureImage } from 'react-bootstrap'

interface FigureWrapperProps {
    src: string
    children: React.ReactNode
}

const FigureWrapper: React.FC<FigureWrapperProps> = ({ src, children }) => {
    return (
        <Figure>
            <FigureImage src={src} />
            <FigureCaption>{children}</FigureCaption>
        </Figure>
    )
}

export default FigureWrapper
