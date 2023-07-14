import {useEffect, useId, useRef} from 'react'
import print from 'print-js'
import React, {FC, ReactNode} from 'react'
import Button from 'react-bootstrap/Button'
import ReactToPrint, { useReactToPrint } from 'react-to-print'


interface PrintSectionProps {
  children: ReactNode,
  label: string
  filename_suffix: string
}

/**
 * Component with a print button for printing the component's child content
 * 
 * @param children Content for printing 
 * @param label Label for the print button
 */
const PrintSection: FC<PrintSectionProps> = ({children, label, filename_suffix}) => {
  const printContainerId = useId();
  return (
    <>
      <Button onClick={event => {
        let title = 'BASC QA Tool'
        if (filename_suffix) {title += ' - ' + filename_suffix}
        document.title = title
        print({
          maxWidth: 2000,
          printable: printContainerId,
          type: 'html', 
          targetStyles: ["*"],
          css: '/print.css',
          documentTitle: 'DOE - Quality Installation Report',
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