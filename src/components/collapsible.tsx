import type { FC } from 'react'
import Accordion from 'react-bootstrap/Accordion'

interface CollapsibleProps {
  children: React.ReactNode
  header: string
}

/**
 * Component with child content that can be shown or hidden by the user
 *
 * @remarks
 * The content is hidden by default.
 * @param children Content that can be shown or hidden by the component
 * @param header The text that shows at the top of the component whether
 * it is collapsed or not
 */
const Collapsible: FC<CollapsibleProps> = ({ children, header }) => {
  return (
    <Accordion style={ { marginBottom: '1rem' } }>
      <Accordion.Item eventKey="0">
        <Accordion.Header>{header}</Accordion.Header>
        <Accordion.Body>{children}</Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default Collapsible
