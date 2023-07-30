import { useEffect, useId, useRef } from 'react'
import print from 'print-js'
import React, { FC, ReactNode } from 'react'
import Button from 'react-bootstrap/Button'

interface PrintSectionProps {
  children: ReactNode,
  label: string
  filename_suffix: string
}

type UrlFields = {
  workflowName: string,
  projectName: string
} | null

/**
 * Extracts fields from a URL.
 *
 * This function takes a URL and extracts specific portions from it.
 *
 * @param {string} url - The URL from which to extract the fields.
 * @returns {UrlFields | null} An object containing the extracted fields: workflowName and projectName,
 *                             or null if the URL does not match the expected pattern.
 *
 * @typedef {Object} UrlFields
 * @property {string} workflowName - The name of the workflow extracted from the URL.
 * @property {string} projectName - The name of the project extracted from the URL.
 */
function extractFieldsFromURL(url: string): UrlFields {
  const regex = /\/([^/]+)\/([^/]+)\/([^/]+)$/; // Regex to match the desired portions
  const match = url.match(regex);

  if (match) {
    const workflowName = match[2]; // e.g. "doe_workflow_hpwh"
    const projectName = match[3]; // e.g. "job"
    return { workflowName, projectName };
  } else {
    return null;
  }
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
        let title = 'Quality Install Tool'
        const urlFields = extractFieldsFromURL(document.location.href);
        console.log(urlFields)
        if (filename_suffix) {title = urlFields?.projectName + '-' + urlFields?.workflowName + '-report'}
        document.title = title
        print({
          maxWidth: 2000,
          printable: printContainerId,
          onPrintDialogClose: () => {document.title = 'Quality Install Tool'},
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
