import {useEffect, useId, useRef} from 'react'
import print from 'print-js'
import React, {FC, ReactNode} from 'react'
import Button from 'react-bootstrap/Button'

interface PrintSectionProps {
  children: ReactNode,
  label: string
  project_name: string,
  workflow_name: string,
}

/**
 * Component with a print button for printing the component's child content
 * 
 * @param children Content for printing 
 * @param label Label for the print button
 */
const PrintSection: FC<PrintSectionProps> = ({children, label, project_name, workflow_name}) => {
  const printContainerId = useId();
  return (
    <>
      <Button onClick={event => {
        let title = 'Quality Install Tool'
        if (project_name && workflow_name) {title = project_name + '-' + workflow_name + '-report'}
        document.title = title
        print({
          maxWidth: 2000,
          printable: printContainerId,
          onPrintDialogClose: () => {document.title = 'Quality Install Tool'},
          type: 'html', 
          targetStyles: ["*"],
          css: [
            '/bootstrap.min.css',
            '/print.css',
          ],
          documentTitle: 'DOE - Quality Installation Report',
          scanStyles: false,
        })}} 
        variant="primary">
        {label}
      </Button>
      <div id={printContainerId}>
        <div className='print-wrapper'>
          {children}
        </div>
      </div>
    </>
  )
}

export default PrintSection