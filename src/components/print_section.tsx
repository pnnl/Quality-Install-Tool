import {useId} from 'react'
import print from 'print-js'
import React, {FC, ReactNode} from 'react'
import Button from 'react-bootstrap/Button'



interface PrintSectionProps {
  children: ReactNode,
  label: string
}

/**
 * Component with a print button for printing the component's child content
 * 
 * @param children Content for printing 
 * @param label Label for the print button
 */
const PrintSection: FC<PrintSectionProps> = ({children, label}) => {
  const printContainerId = useId();
  
  return (
    <>
      <Button onClick={event => print({
          maxWidth: 2000,
          printable: printContainerId,
          type: 'html', 
          targetStyles: ["*"]
        })} 
        variant="primary">
        {label}
      </Button>
      <div id={printContainerId}>
        {children}
      </div>
    </>
  )
}

export default PrintSection