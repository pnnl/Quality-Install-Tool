import {FC} from 'react'
import Tab from 'react-bootstrap/Tab'

interface TabWrapperProps {
  children: React.ReactNode,
  printPdf: boolean,
  title: string,
}

// Note: This is not currently being used.
// TODO: Create a wrapper for the Tabs component instead
const TabWrapper: FC<TabWrapperProps> = ({children, printPdf, title}) => {
  return <Tab eventKey={title} style={{paddingTop:"1rem"}} title="Fooo">{children}</Tab>
};

export default TabWrapper
