import type { FC } from 'react'
import Figure from 'react-bootstrap/Figure'
import FigureImage from 'react-bootstrap/FigureImage'
import FigureCaption from 'react-bootstrap/FigureCaption'

interface FigureWrapperProps {
  children: React.ReactNode
  src: string
}

/**
 * A component that wraps a Figure component in order to set its child component structure
 *
 * @param children Content (most commonly markdown text) to be used as the figure caption
 * @param src The image source passed to an underlying img tag
 */
const FigureWrapper: FC<FigureWrapperProps> = ({ children, src }) => {
  return (
    <Figure>
      <FigureImage src={src} />
      <FigureCaption>
        {children}
      </FigureCaption>
    </Figure>)
}

export default FigureWrapper
